import { useParams, Link } from "react-router-dom";
import { mockArtifacts } from "@/lib/mock-data";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SessionArtifactsPage() {
  const { sessionId } = useParams();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/app/sessions/${sessionId}`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="font-heading text-xl font-bold text-foreground">Artifacts</h1>
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-pen-border-soft bg-pen-elevated/30">
              <th className="text-left text-xs font-semibold text-pen-text-muted px-4 py-3">Name</th>
              <th className="text-left text-xs font-semibold text-pen-text-muted px-4 py-3">Type</th>
              <th className="text-left text-xs font-semibold text-pen-text-muted px-4 py-3">Size</th>
              <th className="text-left text-xs font-semibold text-pen-text-muted px-4 py-3">Created</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pen-border-soft">
            {mockArtifacts.map((a) => (
              <tr key={a.id} className="hover:bg-pen-elevated/20">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{a.display_name}</td>
                <td className="px-4 py-3 text-xs text-pen-text-muted font-mono">{a.mime_type}</td>
                <td className="px-4 py-3 text-xs text-pen-text-muted">{(a.size_bytes / 1024).toFixed(1)} KB</td>
                <td className="px-4 py-3 text-xs text-pen-text-muted font-mono">{new Date(a.created_at).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
