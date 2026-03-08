import { mockAuditEvents } from "@/lib/mock-data";

export default function AdminAuditPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Audit Log</h1>
      <div className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
        <div className="divide-y divide-pen-border-soft">
          {mockAuditEvents.map(e => (
            <div key={e.id} className="px-4 py-3 flex items-center justify-between hover:bg-pen-elevated/20">
              <div>
                <span className="font-mono text-xs text-pen-brand">{e.action}</span>
                <span className="text-xs text-pen-text-muted ml-2">on {e.target_type}/{e.target_id}</span>
                <p className="text-xs text-pen-text-muted mt-0.5">by {e.actor_role} ({e.actor_user_id})</p>
              </div>
              <span className="text-xs text-pen-text-muted font-mono">{new Date(e.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
