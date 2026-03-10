import { adminApi, type WorkerRecord } from "@/lib/api";
import { useEffect, useState } from "react";

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
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Workers</h1>
      <p className="text-sm text-pen-text-muted">Inspect worker status and heartbeat freshness for active execution capacity.</p>
      <div className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
        <div className="divide-y divide-pen-border-soft">
          {workers.map((worker) => (
            <div key={worker.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm text-foreground">{worker.name}</p>
                <p className="text-xs text-pen-text-muted">{worker.cluster}</p>
              </div>
              <div className="text-right text-xs text-pen-text-muted">
                <p>{worker.status}</p>
                <p>{worker.heartbeat_at ? new Date(worker.heartbeat_at).toLocaleString() : "No heartbeat"}</p>
              </div>
            </div>
          ))}
          {!loading && workers.length === 0 && <p className="px-4 py-8 text-center text-sm text-pen-text-muted">No workers available.</p>}
        </div>
      </div>
      {loading && <p className="text-sm text-pen-text-muted">Loading workers...</p>}
      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
