import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Terminal, Zap, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Starter",
    price: "$299",
    period: "/month",
    desc: "For small teams getting started with automated security testing.",
    features: ["5 sessions/month", "1 user", "Email support", "PDF reports", "7-day retention"],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Professional",
    price: "$899",
    period: "/month",
    desc: "For security teams that need continuous testing and deeper analysis.",
    features: ["50 sessions/month", "10 users", "Priority support", "API access", "90-day retention", "Custom agents"],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For organizations with advanced compliance and scale requirements.",
    features: ["Unlimited sessions", "Unlimited users", "Dedicated support", "SSO & SCIM", "Custom retention", "On-prem option"],
    cta: "Contact Sales",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-terminal-green/30 text-terminal-green">PRICING</Badge>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-pen-text-primary mb-4">
            Scale Your <span className="text-terminal-green">Security</span>
          </h1>
          <p className="text-pen-text-secondary max-w-lg mx-auto">Choose the plan that fits your security testing needs.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`p-6 rounded-xl border bg-pen-surface1 flex flex-col transition-all hover:shadow-lg ${
                plan.featured 
                  ? "border-pen-brand shadow-[0_0_30px_hsl(var(--color-brand-primary)_/_0.15)] relative" 
                  : "border-pen-border-soft hover:border-pen-brand/30"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-pen-brand text-white shadow-[0_0_10px_hsl(var(--color-brand-primary)_/_0.4)]">
                    <Zap className="h-3 w-3 mr-1" /> MOST POPULAR
                  </Badge>
                </div>
              )}
              {plan.featured && (
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="h-3 w-3 text-pen-brand" />
                  <span className="text-xs font-semibold text-pen-brand">RECOMMENDED</span>
                </div>
              )}
              <h3 className="font-heading text-xl font-bold text-pen-text-primary">{plan.name}</h3>
              <div className="mt-3 mb-4">
                <span className="text-3xl font-heading font-bold text-pen-text-primary">{plan.price}</span>
                <span className="text-pen-text-muted text-sm">{plan.period}</span>
              </div>
              <p className="text-sm text-pen-text-muted mb-6">{plan.desc}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-pen-text-secondary">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-terminal-green/10 border border-terminal-green/30">
                      <Check className="h-3 w-3 text-terminal-green" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Button 
                variant={plan.featured ? "default" : "outline"} 
                className={plan.featured ? "w-full" : "w-full hover:border-pen-brand/50"} 
                asChild
              >
                <Link to={plan.cta === "Contact Sales" ? "/contact" : "/auth/register"}>
                  {plan.cta === "Contact Sales" ? <Shield className="h-4 w-4 mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
