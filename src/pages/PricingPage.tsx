import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

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
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h1>
          <p className="text-pen-text-secondary max-w-lg mx-auto">Choose the plan that fits your security testing needs.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className={`p-6 rounded-xl border bg-card flex flex-col ${plan.featured ? "border-pen-brand shadow-pen-md" : "border-pen-border-soft"}`}>
              {plan.featured && <span className="text-xs font-semibold text-pen-brand mb-2">MOST POPULAR</span>}
              <h3 className="font-heading text-xl font-bold text-foreground">{plan.name}</h3>
              <div className="mt-3 mb-4">
                <span className="text-3xl font-heading font-bold text-foreground">{plan.price}</span>
                <span className="text-pen-text-muted text-sm">{plan.period}</span>
              </div>
              <p className="text-sm text-pen-text-muted mb-6">{plan.desc}</p>
              <ul className="space-y-2 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-pen-text-secondary">
                    <Check className="h-4 w-4 text-pen-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={plan.featured ? "default" : "outline"} className="w-full" asChild>
                <Link to={plan.cta === "Contact Sales" ? "/contact" : "/auth/register"}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
