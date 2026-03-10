import { StatCard } from "@/components/StatCard";
import { StatusPill } from "@/components/StatusPill";
import { adminApi, type AdminSessionRecord, type SystemMetrics, type WorkerRecord } from "@/lib/api";
import { Activity, Cpu, ListOrdered, AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Admin Overview</h1>
          <p className="mt-1 text-sm text-pen-text-muted">Monitor platform health, identify degraded services, and jump straight into intervention workflows.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reload}><RefreshCw className="h-4 w-4" /> Refresh</Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/sessions">Sessions</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/audit">Audit</Link></Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Sessions" value={system?.active_sessions || 0} icon={Activity} />
        <StatCard label="Queued Jobs" value={system?.queued_jobs || 0} icon={ListOrdered} />
        <StatCard label="Healthy Workers" value={healthyWorkers} icon={Cpu} change={degradedWorkers > 0 ? `${degradedWorkers} degraded/offline` : "All workers healthy"} changeType={degradedWorkers > 0 ? "negative" : "positive"} />
        <StatCard label="Cleanup Backlog" value={cleanupBacklog} icon={AlertTriangle} change={cleanupBacklog > 0 ? "Requires operator review" : "Healthy"} changeType={cleanupBacklog > 0 ? "negative" : "positive"} />
      </div>

      {!loading && error && (
        <div className="rounded-xl border border-pen-danger/30 bg-pen-danger/10 px-4 py-4 text-sm text-pen-danger">
          Admin telemetry is partially unavailable. Refresh the dashboard or inspect the specific admin pages for more detail.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-pen-border-soft bg-card">
          <div className="p-4 border-b border-pen-border-soft"><h2 className="font-heading text-sm font-semibold text-foreground">Worker Status</h2></div>
          <div className="divide-y divide-pen-border-soft">
            {workers.map((worker) => (
              <div key={worker.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm text-foreground">{worker.name}</p>
                  <p className="text-xs text-pen-text-muted">{worker.cluster}</p>
                </div>
                <StatusPill status={worker.status === "healthy" ? "completed" : worker.status === "degraded" ? "finalizing" : "failed"}>{worker.status}</StatusPill>
              </div>
            ))}
            {!loading && workers.length === 0 && <p className="px-4 py-6 text-sm text-pen-text-muted">No workers available. The worker health endpoint returned no active workers.</p>}
          </div>
        </div>

        <div className="rounded-xl border border-pen-border-soft bg-card">
          <div className="p-4 border-b border-pen-border-soft">
            <h2 className="font-heading text-sm font-semibold text-foreground">Queue Snapshot</h2>
          </div>
          <div className="space-y-3 p-4">
            {Object.keys(queue).length > 0 ? Object.entries(queue).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="capitalize text-pen-text-muted">{status}</span>
                <span className="font-mono text-foreground">{count}</span>
              </div>
            )) : <p className="text-sm text-pen-text-muted">No queue stats available. This may mean the queue is empty or the backend could not return status counts.</p>}
            <div className="space-y-2 border-t border-pen-border-soft pt-3">
              <label className="text-xs text-pen-text-muted">Cancel session by ID</label>
              <div className="flex gap-2">
                <input value={cancelSessionID} onChange={(event) => setCancelSessionID(event.target.value)} placeholder="session UUID" className="flex-1 rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm" />
                <Button size="sm" onClick={cancelSession}>Cancel</Button>
              </div>
              {actionMessage && <p className="text-xs text-pen-text-muted">{actionMessage}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-card">
        <div className="flex items-center justify-between border-b border-pen-border-soft p-4">
          <h2 className="font-heading text-sm font-semibold text-foreground">Sessions Needing Attention</h2>
          <Link to="/admin/sessions" className="text-xs text-pen-brand hover:text-pen-brand-hover">View all →</Link>
        </div>
        <div className="divide-y divide-pen-border-soft">
          {degradedSessions.slice(0, 6).map((session) => (
            <div key={session.id} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{session.repo_ref}</p>
                <p className="text-xs text-pen-text-muted">{session.status} • cleanup {session.cleanup_status}</p>
              </div>
              <StatusPill status={session.status}>{session.status}</StatusPill>
            </div>
          ))}
          {!loading && degradedSessions.length === 0 && <p className="px-4 py-6 text-sm text-pen-text-muted">No sessions currently need intervention.</p>}
        </div>
      </div>

      {loading && <p className="text-sm text-pen-text-muted">Loading admin telemetry...</p>}
    </div>
  );
}
