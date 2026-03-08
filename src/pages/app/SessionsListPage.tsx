import { mockSessions } from "@/lib/mock-data";
import { StatusPill } from "@/components/StatusPill";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Download } from "lucide-react";

export default function SessionsListPage() {
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
        {["All", "Running", "Completed", "Failed", "Queued"].map((f) => (
          <button key={f} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${f === "All" ? "bg-pen-brand/10 text-pen-brand border-pen-brand/20" : "text-pen-text-muted border-pen-border-soft hover:text-foreground hover:bg-pen-elevated/50"}`}>
            {f}
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
              {mockSessions.map((s) => (
                <tr key={s.id} className="hover:bg-pen-elevated/20 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/app/sessions/${s.id}`} className="text-sm font-medium text-pen-brand hover:text-pen-brand-hover">{s.repo_ref}</Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-pen-text-secondary truncate max-w-[200px]">{s.target_url}</td>
                  <td className="px-4 py-3"><StatusPill status={s.status}>{s.status}</StatusPill></td>
                  <td className="px-4 py-3 text-xs text-pen-text-muted font-mono">{new Date(s.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
