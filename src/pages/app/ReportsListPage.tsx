import { mockReports } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export default function ReportsListPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Reports</h1>
      <div className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
        <div className="divide-y divide-pen-border-soft">
          {mockReports.map((r) => (
            <Link key={r.id} to={`/app/reports/${r.id}`} className="flex items-center justify-between px-4 py-4 hover:bg-pen-elevated/20 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-5 w-5 text-pen-brand shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                  <p className="text-xs text-pen-text-muted">{new Date(r.generated_at).toLocaleDateString()} • {r.status}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
