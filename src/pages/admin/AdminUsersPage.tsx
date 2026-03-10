import { adminApi, type AdminUserRecord } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";

function formatTimestamp(value: string | null): string {
  if (!value) return "Never";
  return new Date(value).toLocaleString();
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await adminApi.users();
        if (!cancelled) {
          setUsers(payload);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load admin users");
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

  const summary = useMemo(() => ({
    total: users.length,
    admins: users.filter((user) => user.role === "admin").length,
    active: users.filter((user) => user.active_session_count > 0).length,
  }), [users]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Users</h1>
          <p className="mt-1 text-sm text-pen-text-muted">Review real platform accounts, last access activity, and current session load.</p>
        </div>
        <div className="rounded-xl border border-pen-border-soft bg-card px-4 py-3 text-right text-sm">
          <p className="text-pen-text-muted">{summary.total} total users</p>
          <p className="text-foreground">{summary.admins} admins · {summary.active} with active runs</p>
        </div>
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-pen-border-soft bg-pen-elevated/30">
              <th className="px-4 py-3 text-left text-xs font-semibold text-pen-text-muted">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-pen-text-muted">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-pen-text-muted">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-pen-text-muted">Sessions</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-pen-text-muted">Last access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pen-border-soft">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-pen-elevated/20">
                <td className="px-4 py-3 text-sm text-foreground">{user.email}</td>
                <td className="px-4 py-3 text-xs font-mono text-pen-text-muted">{user.role}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${user.status === "active" ? "text-pen-success" : "text-pen-warning"}`}>{user.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-pen-text-muted">{user.session_count} total · {user.active_session_count} active</td>
                <td className="px-4 py-3 text-xs text-pen-text-muted">{formatTimestamp(user.last_login_at || user.last_session_at)}</td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-pen-text-muted">No users available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && <p className="text-sm text-pen-text-muted">Loading users...</p>}
      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
