import { StatCard } from "@/components/StatCard";
import { StatusPill } from "@/components/StatusPill";
import { sessionApi, type DashboardSummary } from "@/lib/api";
import { Play, AlertTriangle, CheckCircle2, Activity, TimerReset } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

function formatRelativeDate(value: string | null): string {
  if (!value) {
    return "No runs yet";
  }
  const diffMs = Date.now() - new Date(value).getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function AppDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await sessionApi.dashboardSummary();
        if (!cancelled) {
          setSummary(payload.summary);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load dashboard summary");
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
  }, []);

  const recentSessions = summary?.recent_sessions || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <Button asChild size="sm">
          <Link to="/app/sessions/new"><Play className="mr-2 h-4 w-4" /> New Session</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Runs" value={summary?.total_runs ?? (loading ? "..." : 0)} icon={TimerReset} change={summary?.last_run_at ? `Last run ${formatRelativeDate(summary.last_run_at)}` : "Ready for your first run"} changeType="neutral" />
        <StatCard label="Active Runs" value={summary?.active_runs ?? (loading ? "..." : 0)} icon={Activity} change={(summary?.active_runs || 0) > 0 ? "Currently executing" : "No runs in flight"} changeType="neutral" />
        <StatCard label="Completed Runs" value={summary?.completed_runs ?? (loading ? "..." : 0)} icon={CheckCircle2} change={`${summary?.completion_rate ?? 0}% completion rate`} changeType="positive" />
        <StatCard label="Needs Attention" value={summary?.needs_attention_runs ?? (loading ? "..." : 0)} icon={AlertTriangle} change={(summary?.needs_attention_runs || 0) > 0 ? "Review failed or unfinished sessions" : "Everything looks healthy"} changeType={(summary?.needs_attention_runs || 0) > 0 ? "negative" : "neutral"} />
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-card">
        <div className="flex items-center justify-between border-b border-pen-border-soft p-4">
          <h2 className="font-heading text-sm font-semibold text-foreground">Recent Sessions</h2>
          <Link to="/app/sessions" className="text-xs text-pen-brand hover:text-pen-brand-hover">View all →</Link>
        </div>
        <div className="divide-y divide-pen-border-soft">
          {recentSessions.map((session) => (
            <Link key={session.id} to={`/app/sessions/${session.id}`} className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-pen-elevated/30">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{session.repo_ref}</p>
                <p className="truncate text-xs text-pen-text-muted">{session.target_url}</p>
                <p className="text-xs text-pen-text-muted">Started {formatRelativeDate(session.created_at)}</p>
              </div>
              <StatusPill status={session.status}>{session.status}</StatusPill>
            </Link>
          ))}
          {!loading && summary && !summary.has_any_sessions && <p className="px-4 py-6 text-sm text-pen-text-muted">No runs yet. Start your first pentest session to populate real activity here.</p>}
          {loading && <p className="px-4 py-6 text-sm text-pen-text-muted">Loading your dashboard activity…</p>}
        </div>
      </div>

      {!loading && summary && summary.has_any_sessions && recentSessions.length === 0 && (
        <div className="rounded-xl border border-dashed border-pen-border-soft bg-card/70 px-4 py-5 text-sm text-pen-text-muted">
          We could not load recent sessions right now, but your aggregate metrics are available above.
        </div>
      )}

      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
