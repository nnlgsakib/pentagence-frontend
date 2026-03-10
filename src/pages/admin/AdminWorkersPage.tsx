import { adminApi, type WorkerRecord } from "@/lib/api";
import { useEffect, useState } from "react";
import { Terminal, Server, Wifi, WifiOff, Clock } from "lucide-react";

export default function AdminWorkersPage() {
  const [workers, setWorkers] = useState<WorkerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await adminApi.workers();
        if (!cancelled) {
          setWorkers(payload);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load workers");
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
    }, 10000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const stats = {
    total: workers.length,
    online: workers.filter(w => w.status === "online").length,
    offline: workers.filter(w => w.status === "offline").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-terminal-green/10 border border-terminal-green/30">
          <Terminal className="h-5 w-5 text-terminal-green" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground font-mono">Workers</h1>
          <p className="text-sm text-pen-text-muted font-mono">Execution capacity and heartbeat monitoring</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-pen-border-soft bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pen-text-muted mb-2">
            <Server className="h-3 w-3 text-terminal-cyan" />
            Total Workers
          </div>
          <p className="text-2xl font-bold font-mono text-foreground">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-terminal-green/30 bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-terminal-green mb-2">
            <Wifi className="h-3 w-3" />
            Online
          </div>
          <p className="text-2xl font-bold font-mono text-terminal-green">{stats.online}</p>
        </div>
        <div className="rounded-xl border border-pen-danger/30 bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pen-danger mb-2">
            <WifiOff className="h-3 w-3" />
            Offline
          </div>
          <p className="text-2xl font-bold font-mono text-pen-danger">{stats.offline}</p>
        </div>
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_150px_120px_180px] gap-4 px-4 py-3 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_45%),linear-gradient(135deg,_rgba(255,255,255,0.02),_rgba(15,23,42,0))] border-b border-pen-border-soft text-xs font-mono uppercase tracking-wider text-pen-text-muted">
          <div>Worker</div>
          <div>Cluster</div>
          <div>Status</div>
          <div>Last Heartbeat</div>
        </div>
        <div className="divide-y divide-pen-border-soft">
          {workers.map((worker) => (
            <div key={worker.id} className="grid grid-cols-[1fr_150px_120px_180px] gap-4 px-4 py-4 hover:bg-pen-elevated/20 transition-colors items-center">
              <div>
                <p className="text-sm font-mono text-foreground">{worker.name}</p>
                <p className="text-xs font-mono text-pen-text-muted">ID: {worker.id.slice(0, 8)}</p>
              </div>
              <div className="text-sm font-mono text-pen-text-muted">{worker.cluster}</div>
              <div>
                <span className={`text-xs font-mono px-2 py-1 rounded flex items-center gap-1 w-fit ${
                  worker.status === "online" 
                    ? "bg-terminal-green/10 text-terminal-green" 
                    : "bg-pen-danger/10 text-pen-danger"
                }`}>
                  {worker.status === "online" ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                  {worker.status}
                </span>
              </div>
              <div className="text-xs font-mono text-pen-text-muted flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {worker.heartbeat_at ? new Date(worker.heartbeat_at).toLocaleString() : "No heartbeat"}
              </div>
            </div>
          ))}
          {!loading && workers.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-pen-text-muted font-mono">
              No workers available.
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-pen-border-soft bg-card p-8 text-center">
          <p className="text-sm font-mono text-pen-text-muted animate-pulse">Loading workers...</p>
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
