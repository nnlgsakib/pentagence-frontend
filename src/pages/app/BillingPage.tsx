import { Button } from "@/components/ui/button";
import { Check, CreditCard, Download } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Billing</h1>
      
      <div className="rounded-xl border border-pen-brand/30 bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs text-pen-brand font-semibold">CURRENT PLAN</span>
            <h2 className="font-heading text-xl font-bold text-foreground">Professional</h2>
          </div>
          <span className="text-2xl font-heading font-bold text-foreground">$899<span className="text-sm text-pen-text-muted">/mo</span></span>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 rounded-lg bg-pen-elevated/30">
            <p className="text-lg font-bold text-foreground">38/50</p>
            <p className="text-xs text-pen-text-muted">Sessions used</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-pen-elevated/30">
            <p className="text-lg font-bold text-foreground">5/10</p>
            <p className="text-xs text-pen-text-muted">Team members</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-pen-elevated/30">
            <p className="text-lg font-bold text-foreground">23 days</p>
            <p className="text-xs text-pen-text-muted">Until renewal</p>
          </div>
        </div>
        <Button variant="outline" size="sm">Manage Plan</Button>
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-card p-6">
        <h2 className="font-heading text-sm font-semibold text-foreground mb-3">Payment Method</h2>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-pen-elevated/30">
          <CreditCard className="h-5 w-5 text-pen-text-muted" />
          <div>
            <p className="text-sm text-foreground">•••• •••• •••• 4242</p>
            <p className="text-xs text-pen-text-muted">Expires 12/2027</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-card p-6">
        <h2 className="font-heading text-sm font-semibold text-foreground mb-3">Recent Invoices</h2>
        <div className="space-y-2">
          {[
            { date: "Mar 1, 2026", amount: "$899.00", status: "Paid" },
            { date: "Feb 1, 2026", amount: "$899.00", status: "Paid" },
          ].map((inv, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-pen-elevated/30">
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground">{inv.date}</span>
                <span className="text-sm text-pen-text-muted">{inv.amount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-pen-success flex items-center gap-1"><Check className="h-3 w-3" />{inv.status}</span>
                <Button variant="ghost" size="sm"><Download className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
