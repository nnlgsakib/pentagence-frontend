import { useParams, Link } from "react-router-dom";
import { mockFindings } from "@/lib/mock-data";
import { SeverityBadge } from "@/components/SeverityBadge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FindingDetailPage() {
  const { findingId } = useParams();
  const finding = mockFindings.find(f => f.id === findingId) || mockFindings[0];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/app/findings"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-xl font-bold text-foreground">{finding.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <SeverityBadge severity={finding.severity} />
            <span className="text-xs text-pen-text-muted font-mono">CVSS {finding.cvss}</span>
            <span className="text-xs text-pen-text-muted">{finding.category}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <section className="rounded-xl border border-pen-border-soft bg-card p-5">
          <h2 className="font-heading text-sm font-semibold text-foreground mb-2">Summary</h2>
          <p className="text-sm text-pen-text-secondary leading-relaxed">{finding.summary}</p>
        </section>

        <section className="rounded-xl border border-pen-border-soft bg-card p-5">
          <h2 className="font-heading text-sm font-semibold text-foreground mb-2">Evidence</h2>
          <pre className="text-xs font-mono text-pen-text-secondary bg-pen-base p-3 rounded-lg overflow-x-auto">{finding.evidence}</pre>
        </section>

        <section className="rounded-xl border border-pen-border-soft bg-card p-5">
          <h2 className="font-heading text-sm font-semibold text-foreground mb-2">Recommendation</h2>
          <p className="text-sm text-pen-text-secondary leading-relaxed">{finding.recommendation}</p>
        </section>

        <section className="rounded-xl border border-pen-border-soft bg-card p-5">
          <h2 className="font-heading text-sm font-semibold text-foreground mb-2">References</h2>
          <div className="space-y-1">
            {finding.references.map((ref, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-pen-brand">
                <ExternalLink className="h-3 w-3" />
                <span>{ref}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
