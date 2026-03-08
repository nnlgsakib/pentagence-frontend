import { StatCard } from "@/components/StatCard";
import { StatusPill } from "@/components/StatusPill";
import { mockPlatformMetrics, mockWorkers, mockAuditEvents } from "@/lib/mock-data";
import { Activity, Cpu, ListOrdered, AlertTriangle, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const m = mockPlatformMetrics;
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Admin Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Sessions" value={m.active_sessions} icon={Activity} />
        <StatCard label="Queued Jobs" value={m.queued_jobs} icon={ListOrdered} />
        <StatCard label="Healthy Workers" value={m.healthy_workers} icon={Cpu} />
        <StatCard label="Failed (24h)" value={m.failed_runs_24h} icon={AlertTriangle} changeType={m.failed_runs_24h > 0 ? "negative" : "positive"} change={m.failed_runs_24h > 0 ? "Needs attention" : "All clear"} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-pen-border-soft bg-card">
          <div className="p-4 border-b border-pen-border-soft"><h2 className="font-heading text-sm font-semibold text-foreground">Worker Status</h2></div>
          <div className="divide-y divide-pen-border-soft">
            {mockWorkers.map(w => (
              <div key={w.id} className="flex items-center justify-between px-4 py-3">
                <div><p className="text-sm text-foreground">{w.name}</p><p className="text-xs text-pen-text-muted">{w.cluster}</p></div>
                <StatusPill status={w.status === "healthy" ? "completed" : w.status === "degraded" ? "finalizing" : "failed"}>{w.status}</StatusPill>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-pen-border-soft bg-card">
          <div className="p-4 border-b border-pen-border-soft flex items-center justify-between">
            <h2 className="font-heading text-sm font-semibold text-foreground">Recent Audit Events</h2>
            <Link to="/admin/audit" className="text-xs text-pen-brand hover:text-pen-brand-hover">View all →</Link>
          </div>
          <div className="divide-y divide-pen-border-soft">
            {mockAuditEvents.slice(0, 4).map(e => (
              <div key={e.id} className="px-4 py-3">
                <p className="text-sm text-foreground"><span className="font-mono text-pen-brand text-xs">{e.action}</span></p>
                <p className="text-xs text-pen-text-muted">{e.actor_role} • {new Date(e.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
