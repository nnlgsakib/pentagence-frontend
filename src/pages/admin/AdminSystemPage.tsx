import { adminApi, type SystemMetrics } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminSystemPage() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await adminApi.system();
        if (!cancelled) {
          setMetrics(payload);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load system metrics");
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

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">System Health</h1>
      <p className="text-sm text-pen-text-muted">Review platform-wide health metrics for active execution, backlog, cleanup, and missing outputs.</p>
      <div className="rounded-xl border border-pen-border-soft bg-card p-4">
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between"><span className="text-pen-text-muted">Active sessions</span><span className="font-mono text-foreground">{metrics?.active_sessions ?? 0}</span></div>
          <div className="flex items-center justify-between"><span className="text-pen-text-muted">Queued jobs</span><span className="font-mono text-foreground">{metrics?.queued_jobs ?? 0}</span></div>
          <div className="flex items-center justify-between"><span className="text-pen-text-muted">Workers</span><span className="font-mono text-foreground">{metrics?.workers ?? 0}</span></div>
          <div className="flex items-center justify-between"><span className="text-pen-text-muted">Cleanup backlog</span><span className="font-mono text-foreground">{metrics?.cleanup_backlog ?? 0}</span></div>
          <div className="flex items-center justify-between"><span className="text-pen-text-muted">Failed runs (24h)</span><span className="font-mono text-foreground">{metrics?.failed_runs_24h ?? 0}</span></div>
          <div className="flex items-center justify-between"><span className="text-pen-text-muted">Missing outputs</span><span className="font-mono text-foreground">{metrics?.missing_outputs ?? 0}</span></div>
        </div>
      </div>
      {loading && <p className="text-sm text-pen-text-muted">Loading system metrics...</p>}
      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
