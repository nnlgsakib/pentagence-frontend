import { useParams, Link } from "react-router-dom";
import { sessionApi, type SessionArtifact, type SessionRecord } from "@/lib/api";
import { ArrowLeft, Download, Eye, FileStack, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatBytes, getArtifactPreviewSupport, type ArtifactPreviewKind } from "@/lib/artifact-preview";

type LoadedPreview = {
  artifactId: string;
  kind: ArtifactPreviewKind;
  sourceLabel: string;
  textContent?: string;
  objectUrl?: string;
};

function getArtifactSectionLabel(sourcePath: string | undefined, category: string): string {
  const normalized = (sourcePath || "").replaceAll("\\", "/");
  if (normalized.includes("/agents/")) {
    return "Agent Logs";
  }
  if (normalized.includes("/deliverables/")) {
    return "Deliverables";
  }
  if (normalized.includes("/prompts/")) {
    return "Prompts";
  }
  if (normalized.endsWith("/workflow.log") || category === "workflow-log") {
    return "Workflow Log";
  }
  if (normalized.endsWith("/session.json") || category === "session-metadata") {
    return "Session Metadata";
  }
  return "Support Files";
}

function sectionSortOrder(label: string): number {
  switch (label) {
    case "Workflow Log":
      return 0;
    case "Session Metadata":
      return 1;
    case "Deliverables":
      return 2;
    case "Agent Logs":
      return 3;
    case "Prompts":
      return 4;
    default:
      return 5;
  }
}

async function blobToText(blob: Blob): Promise<string> {
  if (typeof blob.text === "function") {
    return blob.text();
  }

  return new Response(blob).text();
}

export default function SessionArtifactsPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState<SessionRecord | null>(null);
  const [artifacts, setArtifacts] = useState<SessionArtifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [loadedPreview, setLoadedPreview] = useState<LoadedPreview | null>(null);
  const previewRequestIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!sessionId) {
        setLoading(false);
        setError("Session ID is required");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [sessionPayload, artifactPayload] = await Promise.all([
          sessionApi.get(sessionId),
          sessionApi.listArtifacts(sessionId),
        ]);
        if (!cancelled) {
          setSession(sessionPayload);
          setArtifacts(artifactPayload);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load session outputs");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();
    const interval = window.setInterval(() => {
      void load();
    }, 5000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [sessionId]);

  useEffect(() => {
    return () => {
      if (loadedPreview?.objectUrl) {
        URL.revokeObjectURL(loadedPreview.objectUrl);
      }
    };
  }, [loadedPreview]);

  useEffect(() => {
    if (!selectedArtifactId) {
      return;
    }

    const artifactStillExists = artifacts.some((artifact) => artifact.id === selectedArtifactId);
    if (!artifactStillExists) {
      setSelectedArtifactId(null);
      setLoadedPreview((current) => {
        if (current?.objectUrl) {
          URL.revokeObjectURL(current.objectUrl);
        }
        return null;
      });
      setPreviewError(null);
      setPreviewLoading(false);
    }
  }, [artifacts, selectedArtifactId]);

  const groupedArtifacts = useMemo(() => {
    return artifacts.reduce<Record<string, SessionArtifact[]>>((accumulator, artifact) => {
      const key = getArtifactSectionLabel(artifact.source_path, artifact.category);
      accumulator[key] = accumulator[key] || [];
      accumulator[key].push(artifact);
      return accumulator;
    }, {});
  }, [artifacts]);

  const orderedSections = useMemo(
    () => Object.entries(groupedArtifacts).sort(([left], [right]) => sectionSortOrder(left) - sectionSortOrder(right)),
    [groupedArtifacts],
  );

  const summary = session?.output_summary || {};
  const selectedArtifact = useMemo(
    () => artifacts.find((artifact) => artifact.id === selectedArtifactId) ?? null,
    [artifacts, selectedArtifactId],
  );
  const selectedPreviewSupport = selectedArtifact ? getArtifactPreviewSupport(selectedArtifact) : null;

  const handleDownload = async (artifactId: string, displayName: string) => {
    if (!sessionId) {
      return;
    }

    try {
      const blob = await sessionApi.downloadArtifact(sessionId, artifactId);
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = displayName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(href);
    } catch {
      setError("Artifact download failed");
    }
  };

  const clearPreview = () => {
    previewRequestIdRef.current += 1;
    setSelectedArtifactId(null);
    setPreviewLoading(false);
    setPreviewError(null);
    setLoadedPreview((current) => {
      if (current?.objectUrl) {
        URL.revokeObjectURL(current.objectUrl);
      }
      return null;
    });
  };

  const handlePreview = async (artifact: SessionArtifact) => {
    if (!sessionId) {
      return;
    }

    const previewSupport = getArtifactPreviewSupport(artifact);
    setSelectedArtifactId(artifact.id);
    setPreviewError(null);

    if (previewSupport.kind === "unsupported") {
      previewRequestIdRef.current += 1;
      setPreviewLoading(false);
      setLoadedPreview((current) => {
        if (current?.objectUrl) {
          URL.revokeObjectURL(current.objectUrl);
        }
        return null;
      });
      return;
    }

    if (loadedPreview?.artifactId === artifact.id) {
      return;
    }

    const requestId = previewRequestIdRef.current + 1;
    previewRequestIdRef.current = requestId;
    setPreviewLoading(true);

    try {
      const blob = await sessionApi.downloadArtifact(sessionId, artifact.id);
      if (previewRequestIdRef.current !== requestId) {
        return;
      }

      if (previewSupport.kind === "text") {
        const textContent = await blobToText(blob);
        if (previewRequestIdRef.current !== requestId) {
          return;
        }
        setLoadedPreview((current) => {
          if (current?.objectUrl) {
            URL.revokeObjectURL(current.objectUrl);
          }
          return {
            artifactId: artifact.id,
            kind: "text",
            sourceLabel: previewSupport.sourceLabel,
            textContent,
          };
        });
      } else {
        const objectUrl = URL.createObjectURL(blob);
        if (previewRequestIdRef.current !== requestId) {
          URL.revokeObjectURL(objectUrl);
          return;
        }
        setLoadedPreview((current) => {
          if (current?.objectUrl) {
            URL.revokeObjectURL(current.objectUrl);
          }
          return {
            artifactId: artifact.id,
            kind: previewSupport.kind,
            sourceLabel: previewSupport.sourceLabel,
            objectUrl,
          };
        });
      }
    } catch {
      if (previewRequestIdRef.current !== requestId) {
        return;
      }
      setLoadedPreview((current) => {
        if (current?.objectUrl) {
          URL.revokeObjectURL(current.objectUrl);
        }
        return null;
      });
      setPreviewError("Artifact preview failed");
    } finally {
      if (previewRequestIdRef.current === requestId) {
        setPreviewLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/app/sessions/${sessionId}`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="font-heading text-xl font-bold text-foreground">Session Outputs</h1>
          <p className="text-sm text-pen-text-muted">Categorized files persisted from Shannon `audit-logs`.</p>
        </div>
      </div>

      {session && session.cleanup_status !== "completed" && (
        <div className="rounded-xl border border-pen-border-soft bg-card px-4 py-3 text-sm text-pen-text-muted">
          Output finalization is still in progress or needs recovery. Current cleanup status: <span className="font-medium text-foreground">{session.cleanup_status}</span>
        </div>
      )}

      {session && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-pen-border-soft bg-card px-4 py-3 text-sm">
            <p className="text-xs text-pen-text-muted">Workspace</p>
            <p className="font-medium text-foreground">{String(summary.workspace_name || session.id)}</p>
          </div>
          <div className="rounded-xl border border-pen-border-soft bg-card px-4 py-3 text-sm">
            <p className="text-xs text-pen-text-muted">Workflow</p>
            <p className="truncate font-medium text-foreground">{String(summary.workflow_id || "Pending")}</p>
          </div>
          <div className="rounded-xl border border-pen-border-soft bg-card px-4 py-3 text-sm">
            <p className="text-xs text-pen-text-muted">Persisted Files</p>
            <p className="font-medium text-foreground">{String(summary.persisted_count || artifacts.length)}</p>
          </div>
        </div>
      )}

      <Dialog open={Boolean(selectedArtifact)} onOpenChange={(open) => { if (!open) clearPreview(); }}>
        {selectedArtifact && (
          <DialogContent className="max-h-[92vh] max-w-6xl overflow-hidden border-pen-border-soft bg-card p-0 sm:rounded-2xl">
            <DialogHeader className="gap-3 border-b border-pen-border-soft px-6 py-5 text-left">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1 pr-8">
                  <DialogTitle className="truncate font-heading text-lg text-foreground">{selectedArtifact.display_name}</DialogTitle>
                  <DialogDescription className="mt-1 truncate text-xs text-pen-text-muted">{selectedArtifact.source_path || selectedArtifact.object_key}</DialogDescription>
                  <p className="mt-2 text-xs text-pen-text-muted">{formatBytes(selectedArtifact.size_bytes)} • {selectedArtifact.mime_type || "application/octet-stream"}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedPreviewSupport && (
                    <span className="rounded-full border border-pen-border-soft px-2 py-1 text-[11px] text-pen-text-muted">
                      {selectedPreviewSupport.sourceLabel}
                    </span>
                  )}
                  <Button aria-label={`Download ${selectedArtifact.display_name}`} variant="outline" size="sm" onClick={() => handleDownload(selectedArtifact.id, selectedArtifact.display_name)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 py-5">
              {previewLoading && (
                <div className="flex min-h-[60vh] items-center justify-center gap-2 rounded-2xl border border-dashed border-pen-border-soft bg-background/50 text-sm text-pen-text-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading preview...
                </div>
              )}

              {!previewLoading && previewError && (
                <div className="rounded-2xl border border-dashed border-pen-danger/40 bg-pen-danger/5 px-4 py-6 text-sm text-pen-danger">
                  {previewError}
                </div>
              )}

              {!previewLoading && !previewError && selectedPreviewSupport?.kind === "unsupported" && (
                <div className="rounded-2xl border border-dashed border-pen-border-soft bg-background/50 px-5 py-8 text-sm text-pen-text-muted">
                  <p className="font-medium text-foreground">Preview unavailable</p>
                  <p className="mt-2">{selectedPreviewSupport.reason}</p>
                </div>
              )}

              {!previewLoading && !previewError && loadedPreview && loadedPreview.artifactId === selectedArtifact.id && loadedPreview.kind === "text" && (
                <div className="space-y-3">
                  {loadedPreview.sourceLabel === "HTML source" && (
                    <div className="rounded-2xl border border-pen-border-soft bg-background/50 px-4 py-3 text-sm text-pen-text-muted">
                      HTML artifacts are shown as escaped source to avoid executing untrusted content inside the app.
                    </div>
                  )}
                  <pre className="max-h-[68vh] overflow-auto rounded-2xl border border-pen-border-soft bg-background/80 p-5 text-xs leading-6 text-foreground whitespace-pre-wrap break-words">
                    {loadedPreview.textContent}
                  </pre>
                </div>
              )}

              {!previewLoading && !previewError && loadedPreview && loadedPreview.artifactId === selectedArtifact.id && loadedPreview.kind === "image" && loadedPreview.objectUrl && (
                <div className="flex max-h-[68vh] justify-center overflow-auto rounded-2xl border border-pen-border-soft bg-background/50 p-4">
                  <img src={loadedPreview.objectUrl} alt={selectedArtifact.display_name} className="h-auto max-h-[64vh] max-w-full rounded-xl object-contain" />
                </div>
              )}

              {!previewLoading && !previewError && loadedPreview && loadedPreview.artifactId === selectedArtifact.id && loadedPreview.kind === "pdf" && loadedPreview.objectUrl && (
                <iframe title={`${selectedArtifact.display_name} preview`} src={loadedPreview.objectUrl} className="h-[72vh] w-full rounded-2xl border border-pen-border-soft bg-background" />
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {orderedSections.map(([section, items]) => (
        <div key={section} className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-pen-border-soft px-4 py-3">
            <div>
              <h2 className="font-heading text-sm font-semibold text-foreground">{section}</h2>
              <p className="text-xs text-pen-text-muted">{items.length} persisted file{items.length === 1 ? "" : "s"}</p>
            </div>
            <FileStack className="h-4 w-4 text-pen-brand" />
          </div>
          <div className="divide-y divide-pen-border-soft">
            {items.map((artifact) => (
              <div key={artifact.id} className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <button
                    type="button"
                    className="truncate text-left text-sm font-medium text-foreground underline-offset-4 hover:underline"
                    onClick={() => void handlePreview(artifact)}
                  >
                    {artifact.display_name}
                  </button>
                  <p className="truncate text-xs text-pen-text-muted">{artifact.source_path || artifact.object_key}</p>
                  <p className="text-xs text-pen-text-muted">{formatBytes(artifact.size_bytes)} • {artifact.mime_type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button aria-label={`Preview ${artifact.display_name}`} variant="ghost" size="sm" onClick={() => void handlePreview(artifact)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button aria-label={`Download ${artifact.display_name}`} variant="ghost" size="sm" onClick={() => handleDownload(artifact.id, artifact.display_name)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!loading && artifacts.length === 0 && (
        <div className="rounded-xl border border-dashed border-pen-border-soft bg-card px-4 py-8 text-center text-sm text-pen-text-muted">
          No persisted outputs yet. If the session is still running, audit-log finalization may still be pending.
        </div>
      )}

      {loading && <p className="text-sm text-pen-text-muted">Loading outputs...</p>}
      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
