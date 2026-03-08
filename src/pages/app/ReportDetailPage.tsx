import { useParams, Link } from "react-router-dom";
import { mockReports } from "@/lib/mock-data";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportDetailPage() {
  const { reportId } = useParams();
  const report = mockReports.find(r => r.id === reportId) || mockReports[0];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild><Link to="/app/reports"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div className="flex-1">
          <h1 className="font-heading text-xl font-bold text-foreground">{report.title}</h1>
          <p className="text-xs text-pen-text-muted mt-1">Generated {new Date(report.generated_at).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Share2 className="h-4 w-4 mr-1" /> Share</Button>
          <Button size="sm"><Download className="h-4 w-4 mr-1" /> Download PDF</Button>
        </div>
      </div>
      <div className="rounded-xl border border-pen-border-soft bg-card p-5">
        <h2 className="font-heading text-sm font-semibold text-foreground mb-2">Summary</h2>
        <p className="text-sm text-pen-text-secondary">{report.summary}</p>
      </div>
      <div className="rounded-xl border border-pen-border-soft bg-card p-5">
        <h2 className="font-heading text-sm font-semibold text-foreground mb-3">Sections</h2>
        <div className="space-y-2">
          {report.sections.map((s, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-pen-elevated/30 text-sm text-foreground">
              <span className="text-xs text-pen-text-muted font-mono w-6">{i + 1}.</span>
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
