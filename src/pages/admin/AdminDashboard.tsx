import { StatCard } from "@/components/StatCard";
import { StatusPill } from "@/components/StatusPill";
import { adminApi, type AdminSessionRecord, type SystemMetrics, type WorkerRecord } from "@/lib/api";
import { Activity, Cpu, ListOrdered, AlertTriangle, RefreshCw, Terminal, Shield, Server } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

export default function AdminDashboard() {
  const [workers, setWorkers] = useState<WorkerRecord[]>([]);
  const [queue, setQueue] = useState<Record<string, number>>({});
  const [system, setSystem] = useState<SystemMetrics | null>(null);
  const [sessions, setSessions] = useState<AdminSessionRecord[]>([]);
  const [cancelSessionID, setCancelSessionID] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [nextWorkers, nextQueue, nextSystem, nextSessions] = await Promise.all([
          adminApi.workers(),
          adminApi.queue(),
          adminApi.system(),
          adminApi.sessions(),
        ]);
        if (!cancelled) {
          setWorkers(nextWorkers);
          setQueue(nextQueue);
          setSystem(nextSystem);
          setSessions(nextSessions);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load admin telemetry");
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

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextWorkers, nextQueue, nextSystem, nextSessions] = await Promise.all([
        adminApi.workers(),
        adminApi.queue(),
        adminApi.system(),
        adminApi.sessions(),
      ]);
      setWorkers(nextWorkers);
      setQueue(nextQueue);
      setSystem(nextSystem);
      setSessions(nextSessions);
    } catch {
      setError("Failed to load admin telemetry");
    } finally {
      setLoading(false);
    }
  };

  const healthyWorkers = useMemo(() => workers.filter((worker) => worker.status === "healthy").length, [workers]);
  const cleanupBacklog = system?.cleanup_backlog || 0;
  const degradedSessions = sessions.filter((session) => session.cleanup_status !== "completed" || session.status === "failed");
  const degradedWorkers = workers.filter((worker) => worker.status !== "healthy").length;

  const cancelSession = async () => {
    if (!cancelSessionID.trim()) {
      return;
    }

    const shouldProceed = window.confirm(`Cancel session ${cancelSessionID}?`);
    if (!shouldProceed) {
      return;
    }

    setActionMessage(null);
    try {
      await adminApi.cancelSession(cancelSessionID.trim());
      setActionMessage(`Requested cancel for session ${cancelSessionID.trim()}`);
      setCancelSessionID("");
    } catch {
      setActionMessage("Cancel request failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pen-warning/10 border border-pen-warning/20">
            <Shield className="h-5 w-5 text-pen-warning" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-pen-text-primary">Admin Overview</h1>
            <p className="text-xs text-pen-text-muted font-mono">control://platform-health</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reload} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> 
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/sessions">Sessions</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/audit">Audit</Link></Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Active Sessions" 
          value={system?.active_sessions || 0} 
          icon={Activity} 
          change={loading ? "Scanning..." : "Operational"}
          changeType="neutral" 
        />
        <StatCard 
          label="Queued Jobs" 
          value={system?.queued_jobs || 0} 
          icon={ListOrdered} 
          change="Processing queue"
          changeType="neutral"
        />
        <StatCard 
          label="Healthy Workers" 
          value={healthyWorkers} 
          icon={Cpu} 
          change={degradedWorkers > 0 ? `${degradedWorkers} degraded/offline` : "All workers healthy"} 
          changeType={degradedWorkers > 0 ? "negative" : "positive"} 
        />
        <StatCard 
          label="Cleanup Backlog" 
          value={cleanupBacklog} 
          icon={AlertTriangle} 
          change={cleanupBacklog > 0 ? "Requires operator review" : "Healthy"} 
          changeType={cleanupBacklog > 0 ? "negative" : "positive"} 
        />
      </div>

      {/* Error Banner */}
      {!loading && error && (
        <div className="rounded-xl border border-pen-danger/30 bg-pen-danger/10 px-4 py-4">
          <div className="flex items-center gap-2 text-pen-danger">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-sm font-medium">Admin telemetry is partially unavailable</p>
          </div>
          <p className="text-xs text-pen-danger/80 mt-1">Refresh the dashboard or inspect the specific admin pages for more detail.</p>
        </div>
      )}

      {/* Workers & Queue Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Worker Status */}
        <div className="rounded-xl border border-pen-border-soft bg-pen-surface1">
          <div className="flex items-center gap-2 border-b border-pen-border-soft/50 p-4">
            <Server className="h-4 w-4 text-pen-brand" />
            <h2 className="font-heading text-sm font-semibold text-pen-text-primary">Worker Status</h2>
            <div className="ml-auto flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${workers.length > 0 ? 'bg-terminal-green animate-pulse' : 'bg-pen-danger'}`} />
              <span className="text-xs text-pen-text-muted font-mono">{workers.length} nodes</span>
            </div>
          </div>
          <div className="divide-y divide-pen-border-soft/50">
            {workers.map((worker) => (
              <div key={worker.id} className="flex items-center justify-between px-4 py-3 hover:bg-pen-surface2/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    worker.status === 'healthy' ? 'bg-terminal-green shadow-[0_0_6px_hsl(var(--color-terminal-green))]' :
                    worker.status === 'degraded' ? 'bg-pen-warning' : 'bg-pen-danger'
                  }`} />
                  <div>
                    <p className="text-sm font-mono text-pen-text-primary">{worker.name}</p>
                    <p className="text-xs text-pen-text-muted">{worker.cluster}</p>
                  </div>
                </div>
                <StatusPill status={worker.status === "healthy" ? "completed" : worker.status === "degraded" ? "finalizing" : "failed"}>{worker.status}</StatusPill>
              </div>
            ))}
            {!loading && workers.length === 0 && (
              <div className="px-4 py-6 text-center">
                <Terminal className="h-8 w-8 text-pen-text-muted mx-auto mb-2" />
                <p className="text-sm text-pen-text-muted">No workers available</p>
              </div>
            )}
          </div>
        </div>

        {/* Queue Snapshot */}
        <div className="rounded-xl border border-pen-border-soft bg-pen-surface1">
          <div className="flex items-center gap-2 border-b border-pen-border-soft/50 p-4">
            <ListOrdered className="h-4 w-4 text-terminal-cyan" />
            <h2 className="font-heading text-sm font-semibold text-pen-text-primary">Queue Snapshot</h2>
          </div>
          <div className="space-y-3 p-4">
            {Object.keys(queue).length > 0 ? Object.entries(queue).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="capitalize text-pen-text-muted font-mono">{status}</span>
                <span className="font-mono text-terminal-cyan">{count}</span>
              </div>
            )) : (
              <p className="text-sm text-pen-text-muted">No queue stats available</p>
            )}
            <div className="space-y-2 border-t border-pen-border-soft/50 pt-3">
              <label className="text-xs text-pen-text-muted font-mono">&#62; Cancel session by ID</label>
              <div className="flex gap-2">
                <Input 
                  value={cancelSessionID} 
                  onChange={(event) => setCancelSessionID(event.target.value)} 
                  placeholder="session UUID" 
                  className="flex-1 font-mono text-xs"
                />
                <Button size="sm" variant="destructive" onClick={cancelSession}>Cancel</Button>
              </div>
              {actionMessage && (
                <p className="text-xs font-mono text-terminal-green">{`> ${actionMessage}`}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Needing Attention */}
      <div className="rounded-xl border border-pen-border-soft bg-pen-surface1">
        <div className="flex items-center justify-between border-b border-pen-border-soft/50 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-pen-warning" />
            <h2 className="font-heading text-sm font-semibold text-pen-text-primary">Sessions Needing Attention</h2>
          </div>
          <Link to="/admin/sessions" className="text-xs text-pen-brand hover:text-pen-brand-hover">View all</Link>
        </div>
        <div className="divide-y divide-pen-border-soft/50">
          {degradedSessions.slice(0, 6).map((session) => (
            <div key={session.id} className="flex items-center justify-between px-4 py-3 hover:bg-pen-surface2/30 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-mono text-pen-text-primary">{session.repo_ref}</p>
                <p className="text-xs text-pen-text-muted">{session.status} - cleanup {session.cleanup_status}</p>
              </div>
              <StatusPill status={session.status}>{session.status}</StatusPill>
            </div>
          ))}
          {!loading && degradedSessions.length === 0 && (
            <div className="px-4 py-6 text-center">
              <div className="flex items-center justify-center gap-2 text-terminal-green">
                <Shield className="h-5 w-5" />
                <p className="text-sm">No sessions currently need intervention.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-pen-border-soft bg-pen-surface1 p-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
            <p className="text-sm text-pen-text-muted font-mono">Loading admin telemetry...</p>
          </div>
        </div>
      )}
    </div>
  );
}
