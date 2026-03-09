import { useParams, Link } from "react-router-dom";
import { sessionApi, type SessionAISummary, type SessionArtifact, type SessionRecord } from "@/lib/api";
import { StatusPill } from "@/components/StatusPill";
import { ArrowLeft, ExternalLink, Clock, GitBranch, ShieldCheck, HardDriveDownload, Sparkles, TriangleAlert, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";

type TerminalSummaryAgent = {
  agent?: string;
  duration?: string;
  cost?: string;
};

const statuses = ["queued", "provisioning", "running", "finalizing", "completed", "failed", "canceled"] as const;

function getSummaryValue(summary: Record<string, unknown>, key: string): string {
  const value = summary[key];
  return typeof value === "number" || typeof value === "string" ? String(value) : "-";
}

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

export default function SessionDetailPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState<SessionRecord | null>(null);
  const [artifacts, setArtifacts] = useState<SessionArtifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!sessionId) {
      setLoading(false);
      setError("Session ID is required");
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [sessionPayload, artifactsPayload] = await Promise.all([
          sessionApi.get(sessionId),
          sessionApi.listArtifacts(sessionId),
        ]);
        if (!cancelled) {
          setSession(sessionPayload);
          setArtifacts(artifactsPayload);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load session details");
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

  const duration = useMemo(() => {
    if (!session?.started_at || !session.ended_at) {
      return "In progress";
    }
    const minutes = Math.round((new Date(session.ended_at).getTime() - new Date(session.started_at).getTime()) / 60000);
    return `${minutes}m`;
  }, [session]);

  if (loading) {
    return <p className="text-sm text-pen-text-muted">Loading session...</p>;
  }

  if (error || !session) {
    return <p className="text-sm text-pen-danger">{error || "Session not found"}</p>;
  }

  const currentStep = statuses.indexOf(session.status);
  const canCancel = ["queued", "provisioning", "running", "finalizing"].includes(session.status);
  const summary = session.output_summary || {};
  const terminalSummary = (summary.terminal_summary as Record<string, unknown> | undefined) || {};
  const terminalAgents = Array.isArray(terminalSummary.agents) ? (terminalSummary.agents as TerminalSummaryAgent[]) : [];
  const warnings = Array.isArray(summary.warnings) ? summary.warnings.map(String) : [];
  const aiSummaryStatus = readString(summary.ai_summary_status, session.status === "completed" ? "unavailable" : "pending");
  const aiSummaryError = readString(summary.ai_summary_error);
  const aiSummary = (summary.ai_summary as SessionAISummary | undefined) || undefined;
  const aiSourceArtifacts = readStringArray(summary.ai_summary_source_artifacts);

  const cancelSession = async () => {
    if (!canCancel) {
      return;
    }

    const shouldProceed = window.confirm("Cancel this session?");
    if (!shouldProceed) {
      return;
    }

    try {
      await sessionApi.cancel(session.id);
      const next = await sessionApi.get(session.id);
      setSession(next);
      setActionMessage("Session cancellation requested");
    } catch {
      setActionMessage("Session cancellation failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/app/sessions"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-heading text-xl font-bold text-foreground">{session.repo_ref || session.id}</h1>
          <p className="truncate text-sm text-pen-text-muted">{session.target_url}</p>
        </div>
        <StatusPill status={session.status}>{session.status}</StatusPill>
        {canCancel && (
          <Button variant="outline" size="sm" onClick={cancelSession}>
            Cancel
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {statuses.map((status, index) => (
          <div key={status} className="flex items-center">
            <div className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
              index <= currentStep
                ? session.status === "failed" && index === currentStep
                  ? "bg-pen-danger/10 text-pen-danger"
                  : "bg-pen-brand/10 text-pen-brand"
                : "bg-pen-elevated text-pen-text-muted"
            }`}>
              {status}
            </div>
            {index < statuses.length - 1 && <div className={`mx-1 h-px w-6 ${index < currentStep ? "bg-pen-brand/40" : "bg-pen-border-soft"}`} />}
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-pen-border-soft bg-card p-4">
          <div className="mb-1 flex items-center gap-2 text-xs text-pen-text-muted"><GitBranch className="h-3 w-3" /> Repository</div>
          <p className="text-sm font-medium text-foreground">{session.repo_ref}</p>
        </div>
        <div className="rounded-lg border border-pen-border-soft bg-card p-4">
          <div className="mb-1 flex items-center gap-2 text-xs text-pen-text-muted"><ExternalLink className="h-3 w-3" /> Target</div>
          <p className="truncate text-sm font-medium text-foreground">{session.target_url}</p>
        </div>
        <div className="rounded-lg border border-pen-border-soft bg-card p-4">
          <div className="mb-1 flex items-center gap-2 text-xs text-pen-text-muted"><Clock className="h-3 w-3" /> Duration</div>
          <p className="text-sm font-medium text-foreground">{duration}</p>
        </div>
        <div className="rounded-lg border border-pen-border-soft bg-card p-4">
          <div className="mb-1 flex items-center gap-2 text-xs text-pen-text-muted"><ShieldCheck className="h-3 w-3" /> Cleanup</div>
          <p className="text-sm font-medium text-foreground">{session.cleanup_status}</p>
        </div>
      </div>

      {session.status === "completed" && (
        <div className="overflow-hidden rounded-2xl border border-pen-border-soft bg-card">
          <div className="border-b border-pen-border-soft bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.18),_transparent_45%),linear-gradient(135deg,_rgba(255,255,255,0.02),_rgba(15,23,42,0))] px-5 py-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-pen-text-muted">
                  <Sparkles className="h-4 w-4 text-pen-brand" />
                  AI Security Summary
                </div>
                <h2 className="mt-2 font-heading text-xl font-semibold text-foreground">
                  {aiSummaryStatus === "ready" && aiSummary?.headline
                    ? aiSummary.headline
                    : aiSummaryStatus === "pending"
                      ? "Preparing your readable pentest summary"
                      : aiSummaryStatus === "failed"
                        ? "AI summary unavailable for this run"
                        : "Technical session data is ready"}
                </h2>
                <p className="mt-2 text-sm text-pen-text-muted">
                  {aiSummaryStatus === "ready"
                    ? readString(aiSummary?.risk_overview, "A high-level explanation of what the run found, what it means, and what to do next.")
                    : aiSummaryStatus === "pending"
                      ? "Pentagence has finished the run and persisted the artifacts. The backend is still preparing a user-facing summary from those outputs."
                      : aiSummaryStatus === "failed"
                        ? "The run completed, but the AI summarization step did not finish successfully. You can still inspect the technical evidence below."
                        : "This run does not have an AI summary yet. You can still review the evidence, logs, and outputs below."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  aiSummaryStatus === "ready"
                    ? "bg-pen-success/10 text-pen-success"
                    : aiSummaryStatus === "pending"
                      ? "bg-pen-warning/10 text-pen-warning"
                      : aiSummaryStatus === "failed"
                        ? "bg-pen-danger/10 text-pen-danger"
                        : "bg-pen-elevated text-pen-text-muted"
                }`}>
                  {aiSummaryStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-5 px-5 py-5">
            {aiSummaryStatus === "ready" && aiSummary && (
              <>
                <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
                  <div className="rounded-xl border border-pen-border-soft bg-background/40 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-pen-text-muted">What matters most</p>
                    <p className="mt-2 text-sm leading-7 text-foreground">{readString(aiSummary.business_impact, "Review the findings below for the likely security and business impact.")}</p>
                  </div>
                  <div className="rounded-xl border border-pen-border-soft bg-background/40 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-pen-text-muted">Summary metadata</p>
                    <div className="mt-3 space-y-2 text-sm text-pen-text-muted">
                      <p>Generated: <span className="text-foreground">{readString(aiSummary.generated_at, "Just now")}</span></p>
                      <p>Model: <span className="text-foreground">{readString(aiSummary.model, "Configured backend model")}</span></p>
                      <p>Provider: <span className="text-foreground">{readString(aiSummary.provider, "Configured provider")}</span></p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-pen-border-soft bg-background/40 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <TriangleAlert className="h-4 w-4 text-pen-warning" />
                      Key Findings
                    </div>
                    <ul className="mt-3 space-y-3 text-sm text-foreground">
                      {readStringArray(aiSummary.key_findings).map((finding) => (
                        <li key={finding} className="rounded-lg border border-pen-border-soft bg-card px-3 py-3 leading-6">{finding}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-pen-border-soft bg-background/40 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <WandSparkles className="h-4 w-4 text-pen-brand" />
                      Recommended Next Steps
                    </div>
                    <ul className="mt-3 space-y-3 text-sm text-foreground">
                      {readStringArray(aiSummary.next_steps).map((step) => (
                        <li key={step} className="rounded-lg border border-pen-border-soft bg-card px-3 py-3 leading-6">{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {aiSourceArtifacts.length > 0 && (
                  <div className="rounded-xl border border-pen-border-soft bg-background/40 p-4 text-sm">
                    <p className="text-xs uppercase tracking-[0.16em] text-pen-text-muted">Built from persisted evidence</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {aiSourceArtifacts.map((artifactPath) => (
                        <span key={artifactPath} className="rounded-full border border-pen-border-soft px-3 py-1 text-xs text-pen-text-muted">
                          {artifactPath}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {aiSummaryStatus === "pending" && (
              <div className="rounded-xl border border-dashed border-pen-border-soft bg-background/40 px-4 py-5 text-sm text-pen-text-muted">
                We already have the artifacts and terminal summary. The backend is still generating the narrative summary from those persisted outputs.
              </div>
            )}

            {aiSummaryStatus === "failed" && (
              <div className="rounded-xl border border-dashed border-pen-danger/40 bg-pen-danger/5 px-4 py-5 text-sm text-pen-danger">
                {aiSummaryError || "The AI summary step failed after the session completed."}
              </div>
            )}

            {aiSummaryStatus === "unavailable" && (
              <div className="rounded-xl border border-dashed border-pen-border-soft bg-background/40 px-4 py-5 text-sm text-pen-text-muted">
                AI summary generation is unavailable for this run. You can still inspect the session outputs and workflow evidence below.
              </div>
            )}
          </div>
        </div>
      )}

      {(summary.workflow_id || summary.workspace_name || terminalAgents.length > 0) && (
        <div className="rounded-xl border border-pen-border-soft bg-card p-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-sm font-semibold text-foreground">Shannon Run Summary</h2>
              <p className="text-pen-text-muted">Deep technical runtime metadata from the Shannon workflow log.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-pen-text-muted">Workflow ID</p>
              <p className="break-all font-medium text-foreground">{String(summary.workflow_id || terminalSummary.workflow_id || "Pending")}</p>
            </div>
            <div>
              <p className="text-xs text-pen-text-muted">Workspace</p>
              <p className="font-medium text-foreground">{String(summary.workspace_name || session.id)}</p>
            </div>
            <div>
              <p className="text-xs text-pen-text-muted">Total Cost</p>
              <p className="font-medium text-foreground">{String(terminalSummary.total_cost || "Pending")}</p>
            </div>
          </div>
          {terminalAgents.length > 0 && (
            <div className="mt-4 rounded-lg border border-pen-border-soft">
              <div className="grid grid-cols-[minmax(0,1fr)_120px_120px] gap-3 border-b border-pen-border-soft px-4 py-2 text-xs text-pen-text-muted">
                <span>Agent</span>
                <span>Duration</span>
                <span>Cost</span>
              </div>
              <div className="divide-y divide-pen-border-soft">
                {terminalAgents.map((agent) => (
                  <div key={`${agent.agent}-${agent.duration}`} className="grid grid-cols-[minmax(0,1fr)_120px_120px] gap-3 px-4 py-3 text-sm">
                    <span className="truncate text-foreground">{agent.agent || "Unknown"}</span>
                    <span className="text-pen-text-muted">{agent.duration || "-"}</span>
                    <span className="text-pen-text-muted">{agent.cost || "-"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {(session.cleanup_error || session.error_reason || warnings.length > 0) && (
        <div className="rounded-xl border border-pen-border-soft bg-card p-4 text-sm">
          <h2 className="font-heading text-sm font-semibold text-foreground">Operational Notes</h2>
          <div className="mt-2 space-y-2 text-pen-text-muted">
            {session.error_reason && <p><span className="text-foreground">Execution:</span> {session.error_reason}</p>}
            {session.cleanup_error && <p><span className="text-foreground">Cleanup:</span> {session.cleanup_error}</p>}
            {warnings.map((warning) => <p key={warning}><span className="text-foreground">Output warning:</span> {warning}</p>)}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-pen-border-soft bg-card">
          <div className="flex items-center justify-between border-b border-pen-border-soft p-4">
            <h2 className="font-heading text-sm font-semibold text-foreground">Execution</h2>
            <Link to={`/app/sessions/${session.id}/logs`} className="text-xs text-pen-brand hover:text-pen-brand-hover">View logs →</Link>
          </div>
          <div className="space-y-2 p-4 text-sm text-pen-text-muted">
            <p>Live logs now stream with replay-safe reconnects and backend terminal markers.</p>
            <p>Workflow log found: <span className="font-medium text-foreground">{String(summary.workflow_log_found ?? false)}</span></p>
            <p>Finalized from: <span className="font-medium text-foreground">{getSummaryValue(summary, "finalized_from")}</span></p>
          </div>
        </div>

        <div className="rounded-xl border border-pen-border-soft bg-card">
          <div className="flex items-center justify-between border-b border-pen-border-soft p-4">
            <h2 className="font-heading text-sm font-semibold text-foreground">Outputs ({artifacts.length})</h2>
            <Link to={`/app/sessions/${session.id}/artifacts`} className="text-xs text-pen-brand hover:text-pen-brand-hover">View all →</Link>
          </div>
          <div className="divide-y divide-pen-border-soft">
            {artifacts.length > 0 ? artifacts.slice(0, 4).map((artifact) => (
              <div key={artifact.id} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">{artifact.display_name}</p>
                  <p className="text-xs text-pen-text-muted">{artifact.category} • {(artifact.size_bytes / 1024).toFixed(1)} KB</p>
                </div>
                <HardDriveDownload className="h-4 w-4 text-pen-brand" />
              </div>
            )) : (
              <p className="px-4 py-8 text-center text-sm text-pen-text-muted">No persisted outputs yet.</p>
            )}
          </div>
        </div>
      </div>

      {actionMessage && <p className="text-sm text-pen-text-muted">{actionMessage}</p>}
    </div>
  );
}
