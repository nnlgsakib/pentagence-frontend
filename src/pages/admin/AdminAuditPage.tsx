import { adminApi, type AuditEventRecord } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminAuditPage() {
  const [events, setEvents] = useState<AuditEventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await adminApi.audit();
        if (!cancelled) {
          setEvents(payload);
          setError(null);
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

  const filteredEvents = events.filter((event) => {
    const term = filter.trim().toLowerCase();
    if (!term) return true;
    return [event.action, event.target_type, event.target_id, event.actor_role || "", event.actor_user_id || ""].join(" ").toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold text-foreground">Audit Log</h1>
        <p className="text-sm text-pen-text-muted">Inspect recent administrative and lifecycle events with real audit history from the backend.</p>
      </div>
      <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Filter by action, target, or actor" className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground" />
      <div className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
        <div className="divide-y divide-pen-border-soft">
          {filteredEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between px-4 py-3 hover:bg-pen-elevated/20">
              <div className="min-w-0">
                <span className="font-mono text-xs text-pen-brand">{event.action}</span>
                <span className="ml-2 text-xs text-pen-text-muted">on {event.target_type}/{event.target_id}</span>
                <p className="mt-0.5 truncate text-xs text-pen-text-muted">by {event.actor_role || "system"} ({event.actor_user_id || "n/a"})</p>
              </div>
              <span className="font-mono text-xs text-pen-text-muted">{new Date(event.created_at).toLocaleString()}</span>
            </div>
          ))}
          {!loading && filteredEvents.length === 0 && <p className="px-4 py-8 text-center text-sm text-pen-text-muted">No audit events match the current filter.</p>}
        </div>
      </div>
      {loading && <p className="text-sm text-pen-text-muted">Loading audit events...</p>}
      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
