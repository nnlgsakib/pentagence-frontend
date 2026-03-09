import { adminApi } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminQueuePage() {
  const [queue, setQueue] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await adminApi.queue();
        if (!cancelled) {
          setQueue(payload);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load queue stats");
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
      <h1 className="font-heading text-2xl font-bold text-foreground">Queue</h1>
      <div className="rounded-xl border border-pen-border-soft bg-card p-4">
        <div className="space-y-3">
          {Object.entries(queue).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between text-sm">
              <span className="capitalize text-pen-text-muted">{status}</span>
              <span className="font-mono text-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>
      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
