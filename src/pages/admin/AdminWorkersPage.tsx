import { adminApi, type WorkerRecord } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminWorkersPage() {
  const [workers, setWorkers] = useState<WorkerRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await adminApi.workers();
        if (!cancelled) {
          setWorkers(payload);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load workers");
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
        </div>
      </div>
      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
