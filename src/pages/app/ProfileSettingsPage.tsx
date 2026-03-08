import { Button } from "@/components/ui/button";

export default function ProfileSettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Profile Settings</h1>
      <form className="space-y-4 rounded-xl border border-pen-border-soft bg-card p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
            <input defaultValue="Demo User" className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-pen-brand/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input defaultValue="demo@pentagence.io" readOnly className="w-full rounded-lg border border-pen-border-soft bg-pen-elevated px-3 py-2 text-sm text-pen-text-muted" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Organization</label>
          <input defaultValue="Acme Security" className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-pen-brand/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Timezone</label>
          <select className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-pen-brand/50">
            <option>UTC</option>
            <option>US/Eastern</option>
            <option>US/Pacific</option>
            <option>Europe/London</option>
          </select>
        </div>
        <Button type="button">Save Changes</Button>
      </form>
    </div>
  );
}
