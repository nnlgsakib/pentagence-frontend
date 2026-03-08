import { Shield, Lock, Eye, ScrollText } from "lucide-react";

const controls = [
  { icon: Shield, title: "Sandbox Isolation", desc: "Every pentest session runs in a fully isolated, ephemeral container. No data persists between sessions. Network boundaries prevent lateral movement." },
  { icon: Lock, title: "Role-Based Access", desc: "Strict RBAC separates user and admin surfaces. API keys are scoped to specific actions. No privilege escalation is possible." },
  { icon: Eye, title: "Audit Trails", desc: "Every action is logged to an immutable audit feed. Filter by actor, action, or resource. Export for compliance reporting." },
  { icon: ScrollText, title: "Secret Management", desc: "Secrets are encrypted at rest and injected at runtime. They are never logged or exposed in artifacts. Rotation policies are enforced." },
];

export default function SecurityPage() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">Security & Trust</h1>
          <p className="text-pen-text-secondary max-w-lg mx-auto">Built by security engineers, for security engineers.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {controls.map((c) => (
            <div key={c.title} className="p-6 rounded-xl border border-pen-border-soft bg-card">
              <c.icon className="h-6 w-6 text-pen-brand mb-4" />
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{c.title}</h3>
              <p className="text-sm text-pen-text-muted leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
