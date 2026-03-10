import { Button } from "@/components/ui/button";
import { User, Mail, Building, Globe, Terminal, Save } from "lucide-react";

export default function ProfileSettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-pen-brand/10 border border-pen-brand/30">
          <Terminal className="h-5 w-5 text-pen-brand" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground font-mono">Profile Settings</h1>
          <p className="text-sm text-pen-text-muted font-mono">Configure your account preferences</p>
        </div>
      </div>

      <form className="space-y-6 rounded-xl border border-pen-border-soft bg-card p-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-mono text-pen-text-muted">
              <User className="h-3 w-3 text-terminal-green" />
              Full Name
            </label>
            <input 
              defaultValue="Demo User" 
              className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-4 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-terminal-green/50 focus:border-terminal-green/30 transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-mono text-pen-text-muted">
              <Mail className="h-3 w-3 text-terminal-cyan" />
              Email
            </label>
            <input 
              defaultValue="demo@pentagence.io" 
              readOnly 
              className="w-full rounded-lg border border-pen-border-soft bg-pen-elevated px-4 py-2.5 text-sm font-mono text-pen-text-muted cursor-not-allowed" 
            />
            <p className="text-xs text-pen-text-muted font-mono">Contact support to change email</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-mono text-pen-text-muted">
            <Building className="h-3 w-3 text-pen-brand" />
            Organization
          </label>
          <input 
            defaultValue="Acme Security" 
            className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-4 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-terminal-green/50 focus:border-terminal-green/30 transition-all" 
          />
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-mono text-pen-text-muted">
            <Globe className="h-3 w-3 text-pen-warning" />
            Timezone
          </label>
          <select className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-4 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-terminal-green/50 focus:border-terminal-green/30 transition-all">
            <option>UTC</option>
            <option>US/Eastern</option>
            <option>US/Pacific</option>
            <option>Europe/London</option>
          </select>
        </div>

        <div className="pt-4 border-t border-pen-border-soft">
          <Button type="button" className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
