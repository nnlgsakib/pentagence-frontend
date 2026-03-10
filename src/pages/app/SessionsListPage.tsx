import { sessionApi, type SessionRecord } from "@/lib/api";
import { StatusPill } from "@/components/StatusPill";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Download, Terminal, Search, Filter } from "lucide-react";
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-terminal-green/10 border border-terminal-green/20">
            <Terminal className="h-5 w-5 text-terminal-green" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-pen-text-primary">Sessions</h1>
            <p className="text-xs text-pen-text-muted font-mono">workspace://sessions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button asChild size="sm" variant="default">
            <Link to="/app/sessions/new"><Play className="mr-2 h-4 w-4" /> New Session</Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-pen-text-muted" />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button 
              key={filter} 
              onClick={() => setSelectedFilter(filter)} 
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all capitalize ${
                selectedFilter === filter 
                  ? "bg-pen-brand/10 text-pen-brand border-pen-brand/30 shadow-[0_0_10px_hsl(var(--color-brand-primary)_/_0.1)]" 
                  : "text-pen-text-muted border-pen-border-soft hover:text-pen-text-primary hover:bg-pen-surface2"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs font-mono text-pen-text-muted">
          {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'}
        </span>
      </div>

      {/* Terminal-style table */}
      <div className="rounded-xl border border-pen-border-soft bg-pen-surface1 overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-pen-border-soft bg-pen-surface2/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-pen-danger/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-pen-warning/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-terminal-green/80" />
            </div>
            <span className="text-xs text-pen-text-muted font-mono">sessions.log</span>
          </div>
          <Search className="h-4 w-4 text-pen-text-muted" />
        </div>
        
        {/* Table content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pen-border-soft/50 bg-pen-surface2/30">
                <th className="text-left text-xs font-mono text-pen-text-muted px-4 py-3 uppercase tracking-wider">Repository</th>
                <th className="text-left text-xs font-mono text-pen-text-muted px-4 py-3 uppercase tracking-wider">Target</th>
                <th className="text-left text-xs font-mono text-pen-text-muted px-4 py-3 uppercase tracking-wider">Status</th>
                <th className="text-left text-xs font-mono text-pen-text-muted px-4 py-3 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pen-border-soft/50">
              {filteredSessions.map((s) => (
                <tr key={s.id} className="hover:bg-pen-surface2/30 transition-colors group">
                  <td className="px-4 py-3">
                    <Link to={`/app/sessions/${s.id}`} className="text-sm font-mono font-medium text-pen-brand hover:text-pen-brand-hover transition-colors">
                      {s.repo_ref}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-pen-text-secondary truncate max-w-[200px]">{s.target_url}</td>
                  <td className="px-4 py-3"><StatusPill status={s.status}>{s.status}</StatusPill></td>
                  <td className="px-4 py-3 text-xs font-mono text-pen-text-muted">
                    {new Date(s.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!loading && filteredSessions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Terminal className="h-8 w-8 text-pen-text-muted" />
                      <p className="text-sm text-pen-text-muted">No sessions found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {loading && (
        <div className="rounded-xl border border-pen-border-soft bg-pen-surface1 p-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
            <p className="text-sm text-pen-text-muted font-mono">Loading sessions...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="rounded-lg border border-pen-danger/30 bg-pen-danger/10 px-4 py-3">
          <p className="text-sm text-pen-danger">{error}</p>
        </div>
      )}
    </div>
  );
}
