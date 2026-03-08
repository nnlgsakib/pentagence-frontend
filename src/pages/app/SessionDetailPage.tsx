import { useParams, Link } from "react-router-dom";
import { sessionApi, type SessionArtifact, type SessionRecord } from "@/lib/api";
import { StatusPill } from "@/components/StatusPill";
import { ArrowLeft, ExternalLink, Clock, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";

const statuses = ["queued", "provisioning", "running", "finalizing", "completed", "failed", "canceled"] as const;

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
    return () => {
      cancelled = true;
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
        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-xl font-bold text-foreground truncate">{session.repo_ref || session.id}</h1>
          <p className="text-sm text-pen-text-muted truncate">{session.target_url}</p>
        </div>
        <StatusPill status={session.status}>{session.status}</StatusPill>
        {canCancel && (
          <Button variant="outline" size="sm" onClick={cancelSession}>
            Cancel
          </Button>
        )}
      </div>

      {/* State stepper */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {statuses.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              i <= currentStep
                ? session.status === "failed" && i === currentStep ? "bg-pen-danger/10 text-pen-danger" : "bg-pen-brand/10 text-pen-brand"
                : "bg-pen-elevated text-pen-text-muted"
            }`}>
              {s}
            </div>
            {i < statuses.length - 1 && <div className={`w-6 h-px mx-1 ${i < currentStep ? "bg-pen-brand/40" : "bg-pen-border-soft"}`} />}
          </div>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-pen-border-soft bg-card p-4">
          <div className="flex items-center gap-2 text-pen-text-muted text-xs mb-1"><GitBranch className="h-3 w-3" /> Repository</div>
          <p className="text-sm font-medium text-foreground">{session.repo_ref}</p>
        </div>
        <div className="rounded-lg border border-pen-border-soft bg-card p-4">
          <div className="flex items-center gap-2 text-pen-text-muted text-xs mb-1"><ExternalLink className="h-3 w-3" /> Target</div>
          <p className="text-sm font-medium text-foreground truncate">{session.target_url}</p>
        </div>
        <div className="rounded-lg border border-pen-border-soft bg-card p-4">
          <div className="flex items-center gap-2 text-pen-text-muted text-xs mb-1"><Clock className="h-3 w-3" /> Duration</div>
          <p className="text-sm font-medium text-foreground">
            {session.ended_at && session.started_at
              ? `${Math.round((new Date(session.ended_at).getTime() - new Date(session.started_at).getTime()) / 60000)}m`
              : "In progress"}
          </p>
        </div>
      </div>

      {/* Tabs: Findings, Artifacts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-pen-border-soft bg-card">
          <div className="p-4 border-b border-pen-border-soft flex items-center justify-between">
            <h2 className="font-heading text-sm font-semibold text-foreground">Execution</h2>
            <Link to={`/app/sessions/${session.id}/logs`} className="text-xs text-pen-brand hover:text-pen-brand-hover">View logs →</Link>
          </div>
          <div className="p-4 text-sm text-pen-text-muted space-y-2">
            <p>Use live logs to watch worker output and pipeline state transitions.</p>
            {session.error_reason && <p className="text-pen-danger">Error: {session.error_reason}</p>}
          </div>
        </div>

        <div className="rounded-xl border border-pen-border-soft bg-card">
          <div className="p-4 border-b border-pen-border-soft flex items-center justify-between">
            <h2 className="font-heading text-sm font-semibold text-foreground">Artifacts ({artifacts.length})</h2>
            <Link to={`/app/sessions/${session.id}/artifacts`} className="text-xs text-pen-brand hover:text-pen-brand-hover">View all →</Link>
          </div>
          <div className="divide-y divide-pen-border-soft">
            {artifacts.length > 0 ? artifacts.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{a.display_name}</p>
                  <p className="text-xs text-pen-text-muted">{(a.size_bytes / 1024).toFixed(1)} KB • {a.mime_type}</p>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs"><Link to={`/app/sessions/${session.id}/artifacts`}>Open</Link></Button>
              </div>
            )) : (
              <p className="px-4 py-8 text-sm text-pen-text-muted text-center">No artifacts yet</p>
            )}
          </div>
        </div>
      </div>
      {actionMessage && <p className="text-sm text-pen-text-muted">{actionMessage}</p>}
    </div>
  );
}
