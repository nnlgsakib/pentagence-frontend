import { mockFindings } from "@/lib/mock-data";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Terminal, Search, Filter } from "lucide-react";

const severities = ["all", "critical", "high", "medium", "low", "info"] as const;

export default function FindingsListPage() {
  const [filter, setFilter] = useState<string>("all");
  const filtered = filter === "all" ? mockFindings : mockFindings.filter(f => f.severity === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-terminal-green/10 border border-terminal-green/30">
          <Terminal className="h-5 w-5 text-terminal-green" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground font-mono">Findings</h1>
          <p className="text-sm text-pen-text-muted font-mono">Detected vulnerabilities across all sessions</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {severities.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all capitalize ${
              filter === s 
                ? s === "critical" 
                  ? "bg-pen-danger/10 text-pen-danger border-pen-danger/30"
                  : s === "high"
                    ? "bg-pen-warning/10 text-pen-warning border-pen-warning/30"
                    : "bg-terminal-green/10 text-terminal-green border-terminal-green/30"
                : "text-pen-text-muted border-pen-border-soft hover:text-foreground hover:bg-pen-elevated/50 hover:border-pen-brand/30"
            }`}
          >
            {s} {s !== "all" && <span className="opacity-60">({mockFindings.filter(f => f.severity === s).length})</span>}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_120px_80px] gap-4 px-4 py-3 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.08),_transparent_45%),linear-gradient(135deg,_rgba(255,255,255,0.02),_rgba(15,23,42,0))] border-b border-pen-border-soft text-xs font-mono uppercase tracking-wider text-pen-text-muted">
          <div className="flex items-center gap-2">
            <Search className="h-3 w-3 text-terminal-cyan" />
            Vulnerability
          </div>
          <div>CVSS</div>
          <div>Severity</div>
          <div className="text-right">Status</div>
        </div>
        <div className="divide-y divide-pen-border-soft">
          {filtered.map((f) => (
            <Link 
              key={f.id} 
              to={`/app/findings/${f.id}`} 
              className="grid grid-cols-[1fr_100px_120px_80px] gap-4 px-4 py-4 hover:bg-pen-elevated/30 transition-all group items-center"
            >
              <div className="min-w-0 pr-4">
                <p className="text-sm font-mono text-foreground group-hover:text-terminal-green transition-colors">{f.title}</p>
                <p className="text-xs text-pen-text-muted mt-0.5 truncate font-mono">{f.summary}</p>
              </div>
              <div className="font-mono text-sm">
                <span className={`px-2 py-0.5 rounded ${
                  f.cvss >= 9 ? "bg-pen-danger/20 text-pen-danger" :
                  f.cvss >= 7 ? "bg-pen-warning/20 text-pen-warning" :
                  f.cvss >= 4 ? "bg-terminal-cyan/20 text-terminal-cyan" :
                  "bg-pen-elevated text-pen-text-muted"
                }`}>
                  {f.cvss.toFixed(1)}
                </span>
              </div>
              <div>
                <SeverityBadge severity={f.severity} />
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-pen-text-muted group-hover:text-terminal-green transition-colors">View →</span>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center">
            <p className="text-pen-text-muted font-mono">No findings match the selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
