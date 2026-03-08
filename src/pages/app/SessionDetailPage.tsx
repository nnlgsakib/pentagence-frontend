import { useParams, Link } from "react-router-dom";
import { mockSessions, mockFindings, mockArtifacts } from "@/lib/mock-data";
import { StatusPill } from "@/components/StatusPill";
import { SeverityBadge } from "@/components/SeverityBadge";
import { ArrowLeft, ExternalLink, Clock, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

const statuses = ["queued", "provisioning", "running", "finalizing", "completed"] as const;

export default function SessionDetailPage() {
  const { sessionId } = useParams();
  const session = mockSessions.find(s => s.id === sessionId) || mockSessions[0];
  const findings = mockFindings.filter(f => f.session_id === session.id);
  const artifacts = mockArtifacts.filter(a => a.session_id === session.id);
  const currentStep = statuses.indexOf(session.status as any);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/app/sessions"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-xl font-bold text-foreground truncate">{session.repo_ref}</h1>
          <p className="text-sm text-pen-text-muted truncate">{session.target_url}</p>
        </div>
        <StatusPill status={session.status}>{session.status}</StatusPill>
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
            <h2 className="font-heading text-sm font-semibold text-foreground">Findings ({findings.length})</h2>
            <Link to={`/app/sessions/${session.id}/logs`} className="text-xs text-pen-brand hover:text-pen-brand-hover">View logs →</Link>
          </div>
          <div className="divide-y divide-pen-border-soft">
            {findings.length > 0 ? findings.map((f) => (
              <Link key={f.id} to={`/app/findings/${f.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-pen-elevated/20 transition-colors">
                <span className="text-sm text-foreground truncate pr-3">{f.title}</span>
                <SeverityBadge severity={f.severity} />
              </Link>
            )) : (
              <p className="px-4 py-8 text-sm text-pen-text-muted text-center">No findings yet</p>
            )}
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
                <Button variant="ghost" size="sm" className="text-xs">Download</Button>
              </div>
            )) : (
              <p className="px-4 py-8 text-sm text-pen-text-muted text-center">No artifacts yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
