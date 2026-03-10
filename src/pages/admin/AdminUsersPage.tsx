import { adminApi, type AdminUserRecord } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import { Terminal, Users, Shield, Activity, Clock } from "lucide-react";

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
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-terminal-cyan/10 border border-terminal-cyan/30">
            <Terminal className="h-5 w-5 text-terminal-cyan" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground font-mono">Users</h1>
            <p className="mt-1 text-sm text-pen-text-muted font-mono">Platform account management</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-pen-border-soft bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pen-text-muted mb-2">
            <Users className="h-3 w-3 text-terminal-cyan" />
            Total Users
          </div>
          <p className="text-2xl font-bold font-mono text-foreground">{summary.total}</p>
        </div>
        <div className="rounded-xl border border-pen-border-soft bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pen-text-muted mb-2">
            <Shield className="h-3 w-3 text-pen-brand" />
            Administrators
          </div>
          <p className="text-2xl font-bold font-mono text-foreground">{summary.admins}</p>
        </div>
        <div className="rounded-xl border border-pen-border-soft bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pen-text-muted mb-2">
            <Activity className="h-3 w-3 text-terminal-green" />
            Active Sessions
          </div>
          <p className="text-2xl font-bold font-mono text-foreground">{summary.active}</p>
        </div>
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_100px_120px_180px] gap-4 px-4 py-3 bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.08),_transparent_45%),linear-gradient(135deg,_rgba(255,255,255,0.02),_rgba(15,23,42,0))] border-b border-pen-border-soft text-xs font-mono uppercase tracking-wider text-pen-text-muted">
          <div>Email</div>
          <div>Role</div>
          <div>Status</div>
          <div>Sessions</div>
          <div>Last Access</div>
        </div>
        <div className="divide-y divide-pen-border-soft">
          {users.map((user) => (
            <div key={user.id} className="grid grid-cols-[1fr_100px_100px_120px_180px] gap-4 px-4 py-3 hover:bg-pen-elevated/20 transition-colors items-center">
              <div className="text-sm text-foreground font-mono truncate">{user.email}</div>
              <div className="text-xs font-mono">
                <span className={`px-2 py-1 rounded ${
                  user.role === "admin" 
                    ? "bg-pen-brand/10 text-pen-brand" 
                    : "bg-pen-elevated text-pen-text-muted"
                }`}>
                  {user.role}
                </span>
              </div>
              <div>
                <span className={`text-xs font-mono px-2 py-1 rounded ${
                  user.status === "active" 
                    ? "bg-terminal-green/10 text-terminal-green" 
                    : "bg-pen-warning/10 text-pen-warning"
                }`}>
                  {user.status}
                </span>
              </div>
              <div className="text-xs font-mono text-pen-text-muted">
                {user.session_count} total · {user.active_session_count} active
              </div>
              <div className="text-xs font-mono text-pen-text-muted flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTimestamp(user.last_login_at || user.last_session_at)}
              </div>
            </div>
          ))}
          {!loading && users.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-pen-text-muted font-mono">
              No users available.
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-pen-border-soft bg-card p-8 text-center">
          <p className="text-sm font-mono text-pen-text-muted animate-pulse">Loading users...</p>
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-pen-danger/30 bg-pen-danger/5 p-4">
          <p className="text-sm font-mono text-pen-danger">{error}</p>
        </div>
      )}
    </div>
  );
}
