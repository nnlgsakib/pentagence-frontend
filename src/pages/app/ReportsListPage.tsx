import { mockReports } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, FileText, Terminal, Calendar, HardDrive } from "lucide-react";

export default function ReportsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-terminal-cyan/10 border border-terminal-cyan/30">
          <Terminal className="h-5 w-5 text-terminal-cyan" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground font-mono">Reports</h1>
          <p className="text-sm text-pen-text-muted font-mono">Generated pentest documentation</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockReports.map((r) => (
          <Link 
            key={r.id} 
            to={`/app/reports/${r.id}`} 
            className="group rounded-xl border border-pen-border-soft bg-card p-5 hover:bg-pen-elevated/30 hover:border-terminal-cyan/30 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="p-2 rounded-lg bg-pen-surface2 group-hover:bg-terminal-cyan/10 transition-colors">
                <FileText className="h-5 w-5 text-pen-brand group-hover:text-terminal-cyan transition-colors" />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
                onClick={(e) => e.preventDefault()}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            
            <h3 className="mt-4 text-sm font-mono font-medium text-foreground group-hover:text-terminal-green transition-colors line-clamp-2">
              {r.title}
            </h3>
            
            <div className="mt-4 flex items-center gap-4 text-xs text-pen-text-muted font-mono">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(r.generated_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                {(r.size_kb / 1024).toFixed(1)} MB
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-pen-border-soft">
              <span className={`text-xs font-mono px-2 py-1 rounded ${
                r.status === "ready" 
                  ? "bg-terminal-green/10 text-terminal-green" 
                  : "bg-pen-warning/10 text-pen-warning"
              }`}>
                {r.status}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {mockReports.length === 0 && (
        <div className="rounded-xl border border-dashed border-pen-border-soft p-12 text-center">
          <FileText className="h-12 w-12 text-pen-text-muted mx-auto mb-4" />
          <p className="text-pen-text-muted font-mono">No reports generated yet</p>
        </div>
      )}
    </div>
  );
}
