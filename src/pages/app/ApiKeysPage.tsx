import { Button } from "@/components/ui/button";
import { Key, Copy, Trash2 } from "lucide-react";
import { useState } from "react";

const mockKeys = [
  { id: "k-001", label: "CI/CD Pipeline", prefix: "pk_live_8f3a", scopes: ["sessions:create", "sessions:read"], created_at: "2026-02-15", last_used_at: "2026-03-08" },
];

export default function ApiKeysPage() {
  const [keys] = useState(mockKeys);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">API Keys</h1>
        <Button size="sm"><Key className="h-4 w-4 mr-2" /> Create Key</Button>
      </div>
      <div className="rounded-xl border border-pen-border-soft bg-card overflow-hidden">
        {keys.map((key) => (
          <div key={key.id} className="p-4 border-b border-pen-border-soft last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{key.label}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm"><Copy className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="sm" className="text-pen-danger hover:text-pen-danger"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
            <p className="text-xs font-mono text-pen-text-muted mb-1">{key.prefix}••••••••</p>
            <div className="flex gap-4 text-xs text-pen-text-muted">
              <span>Created {key.created_at}</span>
              <span>Last used {key.last_used_at}</span>
            </div>
            <div className="flex gap-1 mt-2">
              {key.scopes.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-pen-elevated text-pen-text-muted">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
