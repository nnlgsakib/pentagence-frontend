import { Button } from "@/components/ui/button";
import { Check, CreditCard, Download, Terminal, Zap, Users, Calendar, Receipt } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-pen-brand/10 border border-pen-brand/30">
          <Terminal className="h-5 w-5 text-pen-brand" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground font-mono">Billing</h1>
          <p className="text-sm text-pen-text-muted font-mono">Manage your subscription and usage</p>
        </div>
      </div>

      <div className="rounded-xl border border-terminal-green/30 bg-gradient-to-br from-card to-terminal-green/5 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-mono text-terminal-green font-semibold tracking-wider flex items-center gap-2">
              <Zap className="h-3 w-3" />
              CURRENT PLAN
            </span>
            <h2 className="font-heading text-xl font-bold text-foreground mt-1 font-mono">Professional</h2>
          </div>
          <div className="text-right">
            <span className="text-3xl font-heading font-bold text-foreground font-mono">$899</span>
            <span className="text-sm text-pen-text-muted font-mono">/mo</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg bg-pen-surface2 border border-pen-border-soft">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Terminal className="h-4 w-4 text-terminal-cyan" />
              <p className="text-2xl font-bold text-foreground font-mono">38</p>
            </div>
            <p className="text-xs text-pen-text-muted font-mono">of 50 sessions</p>
            <div className="mt-2 h-1.5 rounded-full bg-pen-border-soft overflow-hidden">
              <div className="h-full w-[76%] bg-terminal-cyan rounded-full"></div>
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-pen-surface2 border border-pen-border-soft">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-4 w-4 text-pen-brand" />
              <p className="text-2xl font-bold text-foreground font-mono">5</p>
            </div>
            <p className="text-xs text-pen-text-muted font-mono">of 10 team seats</p>
            <div className="mt-2 h-1.5 rounded-full bg-pen-border-soft overflow-hidden">
              <div className="h-full w-[50%] bg-pen-brand rounded-full"></div>
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-pen-surface2 border border-pen-border-soft">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-pen-warning" />
              <p className="text-2xl font-bold text-foreground font-mono">23</p>
            </div>
            <p className="text-xs text-pen-text-muted font-mono">days until renewal</p>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="gap-2">
          Manage Plan
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-pen-border-soft bg-card p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-pen-border-soft">
            <CreditCard className="h-4 w-4 text-terminal-cyan" />
            <h2 className="font-heading text-sm font-semibold text-foreground font-mono">Payment Method</h2>
          </div>
          
          <div className="mt-4 flex items-center gap-4 p-4 rounded-lg bg-pen-surface2 border border-pen-border-soft">
            <div className="p-3 rounded-lg bg-pen-elevated">
              <CreditCard className="h-6 w-6 text-pen-brand" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-mono text-foreground">•••• •••• •••• 4242</p>
              <p className="text-xs text-pen-text-muted font-mono">Expires 12/2027</p>
            </div>
            <Button variant="ghost" size="sm">Edit</Button>
          </div>
        </div>

        <div className="rounded-xl border border-pen-border-soft bg-card p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-pen-border-soft">
            <Receipt className="h-4 w-4 text-pen-warning" />
            <h2 className="font-heading text-sm font-semibold text-foreground font-mono">Usage This Month</h2>
          </div>
          
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-mono text-pen-text-muted">Sessions</span>
              <span className="text-sm font-mono text-foreground">38 / 50</span>
            </div>
            <div className="h-2 rounded-full bg-pen-border-soft overflow-hidden">
              <div className="h-full w-[76%] bg-terminal-cyan rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-mono text-pen-text-muted">API Calls</span>
              <span className="text-sm font-mono text-foreground">2,847 / 10,000</span>
            </div>
            <div className="h-2 rounded-full bg-pen-border-soft overflow-hidden">
              <div className="h-full w-[28%] bg-terminal-green rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-mono text-pen-text-muted">Storage</span>
              <span className="text-sm font-mono text-foreground">12.4 GB / 50 GB</span>
            </div>
            <div className="h-2 rounded-full bg-pen-border-soft overflow-hidden">
              <div className="h-full w-[25%] bg-pen-brand rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-card p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-pen-border-soft">
          <Receipt className="h-4 w-4 text-terminal-green" />
          <h2 className="font-heading text-sm font-semibold text-foreground font-mono">Recent Invoices</h2>
        </div>
        
        <div className="mt-4 space-y-3">
          {[
            { date: "Mar 1, 2026", amount: "$899.00", status: "Paid" },
            { date: "Feb 1, 2026", amount: "$899.00", status: "Paid" },
            { date: "Jan 1, 2026", amount: "$899.00", status: "Paid" },
          ].map((inv, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-pen-surface2 border border-pen-border-soft">
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-foreground">{inv.date}</span>
                <span className="text-sm font-mono text-pen-text-muted">{inv.amount}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-terminal-green/10 text-terminal-green flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  {inv.status}
                </span>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Download className="h-3.5 w-3.5" />
                  PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
