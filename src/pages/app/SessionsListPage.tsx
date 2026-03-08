import { sessionApi, type SessionRecord } from "@/lib/api";
import { StatusPill } from "@/components/StatusPill";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const FILTERS = ["all", "running", "completed", "failed", "queued", "provisioning", "finalizing", "canceled"] as const;

export default function SessionsListPage() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<(typeof FILTERS)[number]>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const nextSessions = await sessionApi.list();
        if (!cancelled) {
          setSessions(nextSessions);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load sessions");
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

  const filteredSessions = useMemo(() => {
    if (selectedFilter === "all") {
      return sessions;
    }
    return sessions.filter((session) => session.status === selectedFilter);
  }, [selectedFilter, sessions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">Sessions</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export</Button>
          <Button asChild size="sm"><Link to="/app/sessions/new"><Play className="mr-2 h-4 w-4" /> New Session</Link></Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button key={filter} onClick={() => setSelectedFilter(filter)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${selectedFilter === filter ? "bg-pen-brand/10 text-pen-brand border-pen-brand/20" : "text-pen-text-muted border-pen-border-soft hover:text-foreground hover:bg-pen-elevated/50"}`}>
            {filter}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pen-border-soft bg-pen-elevated/30">
                <th className="text-left text-xs font-semibold text-pen-text-muted px-4 py-3">Repository</th>
                <th className="text-left text-xs font-semibold text-pen-text-muted px-4 py-3">Target</th>
                <th className="text-left text-xs font-semibold text-pen-text-muted px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-pen-text-muted px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pen-border-soft">
              {filteredSessions.map((s) => (
                <tr key={s.id} className="hover:bg-pen-elevated/20 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/app/sessions/${s.id}`} className="text-sm font-medium text-pen-brand hover:text-pen-brand-hover">{s.repo_ref}</Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-pen-text-secondary truncate max-w-[200px]">{s.target_url}</td>
                  <td className="px-4 py-3"><StatusPill status={s.status}>{s.status}</StatusPill></td>
                  <td className="px-4 py-3 text-xs text-pen-text-muted font-mono">{new Date(s.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {!loading && filteredSessions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-pen-text-muted">No sessions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {loading && <p className="text-sm text-pen-text-muted">Loading sessions...</p>}
      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
