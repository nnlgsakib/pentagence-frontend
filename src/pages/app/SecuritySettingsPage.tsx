import { Button } from "@/components/ui/button";
import { Shield, Lock, Key, Monitor, Terminal, ShieldCheck } from "lucide-react";

export default function SecuritySettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-terminal-green/10 border border-terminal-green/30">
          <Terminal className="h-5 w-5 text-terminal-green" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground font-mono">Security Settings</h1>
          <p className="text-sm text-pen-text-muted font-mono">Manage your account security</p>
        </div>
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-card p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-pen-border-soft">
          <Lock className="h-4 w-4 text-pen-warning" />
          <h2 className="font-heading text-sm font-semibold text-foreground font-mono">Change Password</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-mono text-pen-text-muted">Current Password</label>
            <input 
              type="password" 
              placeholder="••••••••••••"
              className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-4 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-pen-warning/50 focus:border-pen-warning/30 transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-mono text-pen-text-muted">New Password</label>
            <input 
              type="password" 
              placeholder="••••••••••••"
              className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-4 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-pen-warning/50 focus:border-pen-warning/30 transition-all" 
            />
          </div>
        </div>
        
        <Button className="gap-2">
          <Key className="h-4 w-4" />
          Update Password
        </Button>
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-card p-6">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-pen-border-soft">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-terminal-green" />
            <div>
              <h2 className="font-heading text-sm font-semibold text-foreground font-mono">Multi-Factor Authentication</h2>
              <p className="text-xs text-pen-text-muted font-mono">Add an extra layer of security</p>
            </div>
          </div>
          <span className="text-xs font-mono px-2 py-1 rounded bg-pen-elevated text-pen-text-muted">Coming Soon</span>
        </div>
        <p className="text-sm text-pen-text-muted mt-4 font-mono">
          MFA will support TOTP authenticator apps and hardware security keys for enhanced account protection.
        </p>
        <Button variant="outline" disabled className="mt-4 gap-2">
          <ShieldCheck className="h-4 w-4" />
          Enable MFA (Coming Soon)
        </Button>
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-card p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-pen-border-soft">
          <Monitor className="h-4 w-4 text-terminal-cyan" />
          <h2 className="font-heading text-sm font-semibold text-foreground font-mono">Active Sessions</h2>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="p-4 rounded-lg bg-pen-surface2 border border-pen-border-soft">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-mono text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse"></span>
                  Current Session
                </p>
                <p className="text-xs text-pen-text-muted font-mono mt-1">Chrome • macOS • 192.168.1.1</p>
                <p className="text-xs text-pen-text-muted font-mono">Last active: now</p>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded bg-terminal-green/10 text-terminal-green">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
