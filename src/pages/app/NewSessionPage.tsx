import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ApiError, sessionApi } from "@/lib/api";

export default function NewSessionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [repoRef, setRepoRef] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const created = await sessionApi.create({
        repoRef,
        targetUrl,
        idempotencyKey: crypto.randomUUID(),
      });
      navigate(`/app/sessions/${created.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create session");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">New Pentest Session</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-pen-border-soft bg-card p-6 space-y-4">
          <h2 className="font-heading text-sm font-semibold text-foreground">Target Configuration</h2>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Git Repository URL *</label>
            <input type="text" value={repoRef} onChange={(e) => setRepoRef(e.target.value)} required placeholder="org/repo" className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50" />
            <p className="text-xs text-pen-text-muted mt-1">The repository to scan (SAST)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Live Application URL *</label>
            <input type="url" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} required placeholder="https://example.com" className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50" />
            <p className="text-xs text-pen-text-muted mt-1">The live endpoint to test (DAST)</p>
          </div>
        </div>

        <details className="rounded-xl border border-pen-border-soft bg-card p-6 group">
          <summary className="font-heading text-sm font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
            Advanced Options
            <span className="text-pen-text-muted text-xs group-open:hidden">Click to expand</span>
          </summary>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Scan Depth</label>
              <select className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-pen-brand/50">
                <option>Standard</option>
                <option>Deep</option>
                <option>Quick</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Notification Email</label>
              <input type="email" placeholder="alerts@company.com" className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50" />
            </div>
          </div>
        </details>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Start Session"}
          </Button>
        </div>
        {error && <p className="text-sm text-pen-danger">{error}</p>}
      </form>
    </div>
  );
}
