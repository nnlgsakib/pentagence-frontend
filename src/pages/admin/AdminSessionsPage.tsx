import { adminApi, type AdminSessionRecord } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<AdminSessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await adminApi.sessions();
        if (!cancelled) {
          setSessions(payload);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load admin sessions");
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

  const retryCleanup = async (sessionId: string) => {
    try {
      await adminApi.retryCleanup(sessionId);
      setActionMessage(`Cleanup retry requested for ${sessionId}`);
    } catch {
      setActionMessage("Cleanup retry failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Operational Sessions</h1>
      <div className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pen-border-soft bg-pen-elevated/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-pen-text-muted">Repository</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-pen-text-muted">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-pen-text-muted">Cleanup</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-pen-text-muted">Outputs</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-pen-border-soft">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-pen-elevated/20">
                  <td className="px-4 py-3 text-sm text-foreground">{session.repo_ref}</td>
                  <td className="px-4 py-3 text-xs text-pen-text-muted">{session.status}</td>
                  <td className="px-4 py-3 text-xs text-pen-text-muted">{session.cleanup_status}</td>
                  <td className="px-4 py-3 text-xs text-pen-text-muted">{String(session.output_summary?.persisted_count ?? 0)}</td>
                  <td className="px-4 py-3 text-right">
                    {session.cleanup_status !== "completed" && <Button size="sm" variant="outline" onClick={() => retryCleanup(session.id)}>Retry cleanup</Button>}
                  </td>
                </tr>
              ))}
              {!loading && sessions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-pen-text-muted">No sessions available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {actionMessage && <p className="text-sm text-pen-text-muted">{actionMessage}</p>}
      {loading && <p className="text-sm text-pen-text-muted">Loading sessions...</p>}
      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
