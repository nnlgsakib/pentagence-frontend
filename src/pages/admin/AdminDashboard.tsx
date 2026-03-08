import { StatCard } from "@/components/StatCard";
import { StatusPill } from "@/components/StatusPill";
import { adminApi, type SystemMetrics, type WorkerRecord } from "@/lib/api";
import { Activity, Cpu, ListOrdered, AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [workers, setWorkers] = useState<WorkerRecord[]>([]);
  const [queue, setQueue] = useState<Record<string, number>>({});
  const [system, setSystem] = useState<SystemMetrics | null>(null);
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
        const [nextWorkers, nextQueue, nextSystem] = await Promise.all([adminApi.workers(), adminApi.queue(), adminApi.system()]);
        if (!cancelled) {
          setWorkers(nextWorkers);
          setQueue(nextQueue);
          setSystem(nextSystem);
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

  const healthyWorkers = useMemo(() => workers.filter((worker) => worker.status === "healthy").length, [workers]);
  const failedRuns = queue.failed || queue.canceled || 0;

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
      <h1 className="font-heading text-2xl font-bold text-foreground">Admin Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Sessions" value={system?.active_sessions || 0} icon={Activity} />
        <StatCard label="Queued Jobs" value={system?.queued_jobs || 0} icon={ListOrdered} />
        <StatCard label="Healthy Workers" value={healthyWorkers} icon={Cpu} />
        <StatCard label="Failed/Canceled" value={failedRuns} icon={AlertTriangle} changeType={failedRuns > 0 ? "negative" : "positive"} change={failedRuns > 0 ? "Needs attention" : "All clear"} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-pen-border-soft bg-card">
          <div className="p-4 border-b border-pen-border-soft"><h2 className="font-heading text-sm font-semibold text-foreground">Worker Status</h2></div>
          <div className="divide-y divide-pen-border-soft">
            {workers.map(w => (
              <div key={w.id} className="flex items-center justify-between px-4 py-3">
                <div><p className="text-sm text-foreground">{w.name}</p><p className="text-xs text-pen-text-muted">{w.cluster}</p></div>
                <StatusPill status={w.status === "healthy" ? "completed" : w.status === "degraded" ? "finalizing" : "failed"}>{w.status}</StatusPill>
              </div>
            ))}
            {!loading && workers.length === 0 && <p className="px-4 py-6 text-sm text-pen-text-muted">No workers available</p>}
          </div>
        </div>
        <div className="rounded-xl border border-pen-border-soft bg-card">
          <div className="p-4 border-b border-pen-border-soft">
            <h2 className="font-heading text-sm font-semibold text-foreground">Queue Snapshot</h2>
          </div>
          <div className="p-4 space-y-3">
            {Object.keys(queue).length > 0 ? (
              Object.entries(queue).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="text-pen-text-muted capitalize">{status}</span>
                  <span className="font-mono text-foreground">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-pen-text-muted">No queue stats available</p>
            )}
            <div className="pt-3 border-t border-pen-border-soft space-y-2">
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
      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
