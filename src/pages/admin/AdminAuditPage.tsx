import { adminApi, type AuditEventRecord } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminAuditPage() {
  const [events, setEvents] = useState<AuditEventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await adminApi.audit();
        if (!cancelled) {
          setEvents(payload);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load audit events");
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
      <h1 className="font-heading text-2xl font-bold text-foreground">Audit Log</h1>
      <div className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
        <div className="divide-y divide-pen-border-soft">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between px-4 py-3 hover:bg-pen-elevated/20">
              <div className="min-w-0">
                <span className="font-mono text-xs text-pen-brand">{event.action}</span>
                <span className="ml-2 text-xs text-pen-text-muted">on {event.target_type}/{event.target_id}</span>
                <p className="mt-0.5 truncate text-xs text-pen-text-muted">by {event.actor_role || "system"} ({event.actor_user_id || "n/a"})</p>
              </div>
              <span className="font-mono text-xs text-pen-text-muted">{new Date(event.created_at).toLocaleString()}</span>
            </div>
          ))}
          {!loading && events.length === 0 && <p className="px-4 py-8 text-center text-sm text-pen-text-muted">No audit events available.</p>}
        </div>
      </div>
      {loading && <p className="text-sm text-pen-text-muted">Loading audit events...</p>}
      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
