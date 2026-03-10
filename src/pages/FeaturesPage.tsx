import { motion } from "framer-motion";
import { Shield, Cpu, FileText, Lock, Search, Zap, BarChart3, Users, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
          <Badge variant="outline" className="mb-4 border-terminal-green/30 text-terminal-green">CAPABILITIES</Badge>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-pen-text-primary mb-4">
            Platform <span className="text-terminal-green">Modules</span>
          </h1>
          <p className="text-pen-text-secondary max-w-lg mx-auto">Everything you need for continuous, automated security testing.</p>
        </div>
        <div className="space-y-16 max-w-4xl mx-auto">
          {categories.map((cat, ci) => (
            <div key={cat.title}>
              <div className="flex items-center gap-3 mb-6">
                <Terminal className="h-4 w-4 text-pen-brand" />
                <h2 className="font-heading text-xl font-semibold text-pen-text-primary border-b border-pen-border-soft pb-2 flex-1">{cat.title}</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {cat.items.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="p-5 rounded-xl border border-pen-border-soft bg-pen-surface1 hover:border-pen-brand/30 hover:shadow-[0_0_15px_hsl(var(--color-brand-primary)_/_0.1)] transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <item.icon className="h-5 w-5 text-pen-brand group-hover:text-terminal-green transition-colors" />
                      <div className="w-2 h-2 rounded-full bg-terminal-green/50 group-hover:bg-terminal-green group-hover:shadow-[0_0_6px_hsl(var(--color-terminal-green))] transition-all" />
                    </div>
                    <h3 className="font-heading text-base font-semibold text-pen-text-primary mb-1">{item.name}</h3>
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
