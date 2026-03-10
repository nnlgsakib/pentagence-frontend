import { adminApi } from "@/lib/api";
import { useEffect, useState } from "react";
import { Terminal, ListOrdered, Clock, PlayCircle, PauseCircle, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function AdminQueuePage() {
  const [queue, setQueue] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await adminApi.queue();
        if (!cancelled) {
          setQueue(payload);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load queue stats");
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
  }, []);

  const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    pending: { icon: Clock, color: "text-pen-text-muted", bg: "bg-pen-elevated" },
    queued: { icon: ListOrdered, color: "text-terminal-cyan", bg: "bg-terminal-cyan/10" },
    running: { icon: PlayCircle, color: "text-terminal-green", bg: "bg-terminal-green/10" },
    paused: { icon: PauseCircle, color: "text-pen-warning", bg: "bg-pen-warning/10" },
    completed: { icon: CheckCircle, color: "text-pen-success", bg: "bg-pen-success/10" },
    failed: { icon: XCircle, color: "text-pen-danger", bg: "bg-pen-danger/10" },
    retry: { icon: AlertCircle, color: "text-pen-brand", bg: "bg-pen-brand/10" },
  };

  const total = Object.values(queue).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-pen-warning/10 border border-pen-warning/30">
          <Terminal className="h-5 w-5 text-pen-warning" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground font-mono">Queue</h1>
          <p className="text-sm text-pen-text-muted font-mono">Job state monitoring and backlog detection</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-pen-border-soft bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pen-text-muted mb-2">
            <ListOrdered className="h-3 w-3 text-terminal-cyan" />
            Total Jobs
          </div>
          <p className="text-2xl font-bold font-mono text-foreground">{total}</p>
        </div>
        <div className="rounded-xl border border-terminal-green/30 bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-terminal-green mb-2">
            <PlayCircle className="h-3 w-3" />
            Running
          </div>
          <p className="text-2xl font-bold font-mono text-terminal-green">{queue.running || 0}</p>
        </div>
        <div className="rounded-xl border border-terminal-cyan/30 bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-terminal-cyan mb-2">
            <Clock className="h-3 w-3" />
            Queued
          </div>
          <p className="text-2xl font-bold font-mono text-terminal-cyan">{queue.queued || 0}</p>
        </div>
        <div className="rounded-xl border border-pen-danger/30 bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pen-danger mb-2">
            <XCircle className="h-3 w-3" />
            Failed
          </div>
          <p className="text-2xl font-bold font-mono text-pen-danger">{queue.failed || 0}</p>
        </div>
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-card p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-pen-border-soft">
          <ListOrdered className="h-4 w-4 text-terminal-cyan" />
          <h2 className="font-heading text-sm font-semibold text-foreground font-mono">Job States</h2>
        </div>

        <div className="mt-4 space-y-3">
          {Object.entries(queue).length > 0 ? (
            Object.entries(queue).map(([status, count]) => {
              const config = statusConfig[status] || statusConfig.pending;
              const Icon = config.icon;
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={status} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg}`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-mono capitalize text-foreground">{status}</span>
                      <span className="text-sm font-mono text-pen-text-muted">{count} jobs</span>
                    </div>
                    <div className="h-2 rounded-full bg-pen-border-soft overflow-hidden">
                      <div 
                        className={`h-full ${config.bg.replace('/10', '')} rounded-full transition-all duration-500`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm font-mono text-pen-text-muted text-center py-8">No queue stats available.</p>
          )}
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-pen-border-soft bg-card p-8 text-center">
          <p className="text-sm font-mono text-pen-text-muted animate-pulse">Loading queue stats...</p>
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-pen-danger/30 bg-pen-danger/5 p-4">
          <p className="text-sm font-mono text-pen-danger">{error}</p>
        </div>
      )}
    </div>
  );
}
