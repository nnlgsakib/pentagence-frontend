import { adminApi, type AdminSessionRecord } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { StatusPill } from "@/components/StatusPill";

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
          setError(null);
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

  const reload = async () => {
    setLoading(true);
    try {
      const payload = await adminApi.sessions();
      setSessions(payload);
      setError(null);
    } catch {
      setError("Failed to load admin sessions");
    } finally {
      setLoading(false);
    }
  };

  const retryCleanup = async (sessionId: string) => {
    try {
      await adminApi.retryCleanup(sessionId);
      setActionMessage(`Cleanup retry requested for ${sessionId}`);
      await reload();
    } catch {
      setActionMessage("Cleanup retry failed");
    }
  };

  const forceFinalize = async (sessionId: string) => {
    try {
      const result = await adminApi.forceFinalize(sessionId);
      setActionMessage(result.message || `Forced finalization requested for ${sessionId}`);
      await reload();
    } catch {
      setActionMessage("Force finalize failed");
    }
  };

  const cancelSession = async (sessionId: string) => {
    try {
      await adminApi.cancelSession(sessionId);
      setActionMessage(`Cancel requested for ${sessionId}`);
      await reload();
    } catch {
      setActionMessage("Cancel request failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Operational Sessions</h1>
          <p className="mt-1 text-sm text-pen-text-muted">Intervene on stuck, degraded, or cleanup-blocked sessions with deterministic feedback.</p>
        </div>
        <Button variant="outline" onClick={reload}>Refresh</Button>
      </div>
      <div className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pen-border-soft bg-pen-elevated/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-pen-text-muted">Repository</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-pen-text-muted">User</th>
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
                  <td className="px-4 py-3 text-xs text-pen-text-muted font-mono">{session.user_id}</td>
                  <td className="px-4 py-3 text-xs text-pen-text-muted"><StatusPill status={session.status}>{session.status}</StatusPill></td>
                  <td className="px-4 py-3 text-xs text-pen-text-muted">{session.cleanup_status}</td>
                  <td className="px-4 py-3 text-xs text-pen-text-muted">{String(session.output_summary?.persisted_count ?? 0)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      {session.status !== "completed" && session.status !== "failed" && session.status !== "canceled" && (
                        <Button size="sm" variant="outline" onClick={() => cancelSession(session.id)}>Cancel</Button>
                      )}
                      {session.cleanup_status !== "completed" && <Button size="sm" variant="outline" onClick={() => retryCleanup(session.id)}>Retry cleanup</Button>}
                      {session.status === "running" || session.status === "finalizing" ? (
                        <Button size="sm" variant="outline" onClick={() => forceFinalize(session.id)}>Force finalize</Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && sessions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-pen-text-muted">No sessions available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {actionMessage && <p className="rounded-lg border border-pen-border-soft bg-pen-elevated/30 px-3 py-2 text-sm text-pen-text-secondary">{actionMessage}</p>}
      {loading && <p className="text-sm text-pen-text-muted">Loading sessions...</p>}
      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
