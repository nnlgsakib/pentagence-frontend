import { motion } from "framer-motion";
import { Shield, Cpu, FileText, Lock, Search, Zap, BarChart3, Users } from "lucide-react";

const categories = [
  {
    title: "Orchestration",
    items: [
      { icon: Cpu, name: "Agent Management", desc: "Deploy and coordinate multiple security agents per session." },
      { icon: Zap, name: "Parallel Execution", desc: "Run SAST, DAST, and recon tasks concurrently." },
    ],
  },
  {
    title: "Execution",
    items: [
      { icon: Search, name: "Deep Scanning", desc: "AI-driven vulnerability discovery across web and API surfaces." },
      { icon: Shield, name: "Sandbox Isolation", desc: "Each session runs in an ephemeral isolated environment." },
    ],
  },
  {
    title: "Reporting",
    items: [
      { icon: FileText, name: "Automated Reports", desc: "PDF and structured reports generated automatically." },
      { icon: BarChart3, name: "Trend Analysis", desc: "Track security posture across multiple sessions." },
    ],
  },
  {
    title: "Governance",
    items: [
      { icon: Lock, name: "RBAC", desc: "Fine-grained role-based access for teams." },
      { icon: Users, name: "Audit Trails", desc: "Immutable logs of every action taken." },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">Platform Capabilities</h1>
          <p className="text-pen-text-secondary max-w-lg mx-auto">Everything you need for continuous, automated security testing.</p>
        </div>
        <div className="space-y-16 max-w-4xl mx-auto">
          {categories.map((cat, ci) => (
            <div key={cat.title}>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-6 border-b border-pen-border-soft pb-2">{cat.title}</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {cat.items.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="p-5 rounded-xl border border-pen-border-soft bg-card hover:border-pen-brand/30 transition-colors"
                  >
                    <item.icon className="h-5 w-5 text-pen-brand mb-3" />
                    <h3 className="font-heading text-base font-semibold text-foreground mb-1">{item.name}</h3>
                    <p className="text-sm text-pen-text-muted">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
