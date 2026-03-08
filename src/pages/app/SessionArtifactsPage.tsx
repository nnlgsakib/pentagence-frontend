import { useParams, Link } from "react-router-dom";
import { sessionApi, type SessionArtifact } from "@/lib/api";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function SessionArtifactsPage() {
  const { sessionId } = useParams();
  const [artifacts, setArtifacts] = useState<SessionArtifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!sessionId) {
        setLoading(false);
        setError("Session ID is required");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const payload = await sessionApi.listArtifacts(sessionId);
        if (!cancelled) {
          setArtifacts(payload);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load artifacts");
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
  }, [sessionId]);

  const handleDownload = async (artifactId: string, displayName: string) => {
    if (!sessionId) {
      return;
    }

    try {
      const blob = await sessionApi.downloadArtifact(sessionId, artifactId);
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = displayName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(href);
    } catch {
      setError("Artifact download failed");
    }
  };

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
            {artifacts.map((a) => (
              <tr key={a.id} className="hover:bg-pen-elevated/20">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{a.display_name}</td>
                <td className="px-4 py-3 text-xs text-pen-text-muted font-mono">{a.mime_type}</td>
                <td className="px-4 py-3 text-xs text-pen-text-muted">{(a.size_bytes / 1024).toFixed(1)} KB</td>
                <td className="px-4 py-3 text-xs text-pen-text-muted font-mono">{new Date(a.created_at).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(a.id, a.display_name)}><Download className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
            {!loading && artifacts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-pen-text-muted">No artifacts available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {loading && <p className="text-sm text-pen-text-muted">Loading artifacts...</p>}
      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
