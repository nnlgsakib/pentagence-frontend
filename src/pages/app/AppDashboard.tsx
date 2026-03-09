import { StatCard } from "@/components/StatCard";
import { StatusPill } from "@/components/StatusPill";
import { sessionApi, type SessionRecord } from "@/lib/api";
import { Play, AlertTriangle, Clock, FileStack, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";

export default function AppDashboard() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await sessionApi.list();
        if (!cancelled) {
          setSessions(payload);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load sessions");
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeSessions = useMemo(() => sessions.filter((session) => ["running", "provisioning", "finalizing"].includes(session.status)).length, [sessions]);
  const failedRecent = useMemo(() => sessions.filter((session) => session.status === "failed").length, [sessions]);
  const cleanupBacklog = useMemo(() => sessions.filter((session) => session.cleanup_status !== "completed").length, [sessions]);
  const averageDuration = useMemo(() => {
    const completedDurations = sessions
      .filter((session) => session.started_at && session.ended_at)
      .map((session) => new Date(session.ended_at as string).getTime() - new Date(session.started_at as string).getTime());

    if (completedDurations.length === 0) {
      return "-";
    }

    const averageMinutes = Math.round(completedDurations.reduce((sum, value) => sum + value, 0) / completedDurations.length / 60000);
    return `${averageMinutes}m`;
  }, [sessions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <Button asChild size="sm">
          <Link to="/app/sessions/new"><Play className="mr-2 h-4 w-4" /> New Session</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Sessions" value={activeSessions} icon={Activity} change={activeSessions > 0 ? "Live execution" : "Idle"} changeType="neutral" />
        <StatCard label="Cleanup Backlog" value={cleanupBacklog} icon={FileStack} change={cleanupBacklog > 0 ? "Needs review" : "Healthy"} changeType={cleanupBacklog > 0 ? "negative" : "positive"} />
        <StatCard label="Failed Runs" value={failedRecent} icon={AlertTriangle} change={failedRecent > 0 ? "Action needed" : "All clear"} changeType={failedRecent > 0 ? "negative" : "positive"} />
        <StatCard label="Avg. Duration" value={averageDuration} icon={Clock} change="Completed sessions only" changeType="neutral" />
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-card">
        <div className="flex items-center justify-between border-b border-pen-border-soft p-4">
          <h2 className="font-heading text-sm font-semibold text-foreground">Recent Sessions</h2>
          <Link to="/app/sessions" className="text-xs text-pen-brand hover:text-pen-brand-hover">View all →</Link>
        </div>
        <div className="divide-y divide-pen-border-soft">
          {sessions.slice(0, 6).map((session) => (
            <Link key={session.id} to={`/app/sessions/${session.id}`} className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-pen-elevated/30">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{session.repo_ref}</p>
                <p className="truncate text-xs text-pen-text-muted">{session.target_url}</p>
                <p className="text-xs text-pen-text-muted">Cleanup: {session.cleanup_status}</p>
              </div>
              <StatusPill status={session.status}>{session.status}</StatusPill>
            </Link>
          ))}
          {sessions.length === 0 && <p className="px-4 py-6 text-sm text-pen-text-muted">No sessions yet</p>}
        </div>
      </div>

      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
