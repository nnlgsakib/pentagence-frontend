import { useParams, Link } from "react-router-dom";
import { sessionApi, type SessionArtifact, type SessionRecord } from "@/lib/api";
import { StatusPill } from "@/components/StatusPill";
import { ArrowLeft, ExternalLink, Clock, GitBranch, ShieldCheck, HardDriveDownload } from "lucide-react";
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

      {(summary.workflow_id || summary.workspace_name || terminalAgents.length > 0) && (
        <div className="rounded-xl border border-pen-border-soft bg-card p-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-sm font-semibold text-foreground">Shannon Run Summary</h2>
              <p className="text-pen-text-muted">Resolved workflow metadata and final agent breakdown from the Shannon workflow log.</p>
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
