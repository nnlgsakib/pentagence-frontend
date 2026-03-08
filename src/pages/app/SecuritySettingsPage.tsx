import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function SecuritySettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Security Settings</h1>
      <div className="rounded-xl border border-pen-border-soft bg-card p-6 space-y-4">
        <h2 className="font-heading text-sm font-semibold text-foreground">Change Password</h2>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
          <input type="password" className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-pen-brand/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
          <input type="password" className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-pen-brand/50" />
        </div>
        <Button>Update Password</Button>
      </div>
      <div className="rounded-xl border border-pen-border-soft bg-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="h-5 w-5 text-pen-brand" />
          <h2 className="font-heading text-sm font-semibold text-foreground">Multi-Factor Authentication</h2>
        </div>
        <p className="text-sm text-pen-text-muted mb-4">Add an extra layer of security to your account.</p>
        <Button variant="outline" disabled>Enable MFA (Coming Soon)</Button>
      </div>
      <div className="rounded-xl border border-pen-border-soft bg-card p-6">
        <h2 className="font-heading text-sm font-semibold text-foreground mb-3">Active Sessions</h2>
        <div className="p-3 rounded-lg bg-pen-elevated/30 text-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-foreground font-medium">Current Session</p>
              <p className="text-xs text-pen-text-muted">Chrome • macOS • Last active now</p>
            </div>
            <span className="text-xs text-pen-success">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
