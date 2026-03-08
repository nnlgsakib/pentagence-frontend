import { mockFindings } from "@/lib/mock-data";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Link } from "react-router-dom";
import { useState } from "react";

const severities = ["all", "critical", "high", "medium", "low", "info"] as const;

export default function FindingsListPage() {
  const [filter, setFilter] = useState<string>("all");
  const filtered = filter === "all" ? mockFindings : mockFindings.filter(f => f.severity === filter);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Findings</h1>

      <div className="flex flex-wrap gap-2">
        {severities.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${
              filter === s ? "bg-pen-brand/10 text-pen-brand border-pen-brand/20" : "text-pen-text-muted border-pen-border-soft hover:text-foreground hover:bg-pen-elevated/50"
            }`}
          >
            {s} {s !== "all" && `(${mockFindings.filter(f => f.severity === s).length})`}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
        <div className="divide-y divide-pen-border-soft">
          {filtered.map((f) => (
            <Link key={f.id} to={`/app/findings/${f.id}`} className="flex items-center justify-between px-4 py-4 hover:bg-pen-elevated/20 transition-colors">
              <div className="min-w-0 flex-1 pr-4">
                <p className="text-sm font-medium text-foreground">{f.title}</p>
                <p className="text-xs text-pen-text-muted mt-0.5 truncate">{f.summary}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-pen-text-muted font-mono hidden sm:inline">CVSS {f.cvss}</span>
                <SeverityBadge severity={f.severity} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
