import { motion } from "framer-motion";
import { Terminal, Cpu, Search, FileCheck, ArrowRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  { 
    phase: "01", 
    title: "Target Submission", 
    detail: "Define your target by providing a git repository URL and a live application endpoint. Configure scan depth, agent types, and notification preferences.",
    time: "~30 seconds",
    icon: Terminal
  },
  { 
    phase: "02", 
    title: "Agent Provisioning", 
    detail: "Pentagence spins up an isolated sandbox and deploys Shannon-based agents. Each agent specializes in a domain: recon, SAST, DAST, or API testing.",
    time: "~1 minute",
    icon: Cpu
  },
  { 
    phase: "03", 
    title: "Execution & Discovery", 
    detail: "Agents work in parallel, sharing context via a shared intelligence graph. Findings are validated and de-duplicated in realtime.",
    time: "5-30 minutes",
    icon: Search
  },
  { 
    phase: "04", 
    title: "Report Generation", 
    detail: "All findings are consolidated into a structured report with severity ratings, evidence, and remediation guidance. Export as PDF or JSON.",
    time: "~2 minutes",
    icon: FileCheck
  },
];

export default function HowItWorksPage() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-4 border-terminal-green/30 text-terminal-green">WORKFLOW</Badge>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-pen-text-primary mb-4">
            How <span className="text-terminal-green">Pentagence</span> Works
          </h1>
          <p className="text-pen-text-secondary max-w-lg mx-auto text-lg">A fully automated lifecycle from target to findings.</p>
        </div>

        {/* Terminal-style timeline */}
        <div className="max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-0 w-px bg-gradient-to-b from-pen-brand/50 to-transparent" />
              )}
              
              <div className="flex gap-6 pb-12 last:pb-0">
                {/* Step number badge */}
                <div className="relative flex flex-col items-center">
                  <div className="h-10 w-10 rounded-lg border border-pen-brand/30 bg-pen-brand/10 flex items-center justify-center z-10">
                    <span className="font-mono text-sm font-bold text-pen-brand">{step.phase}</span>
                  </div>
                  {/* Glowing dot */}
                  <div className="absolute top-10 w-2 h-2 rounded-full bg-terminal-green shadow-[0_0_8px_hsl(var(--color-terminal-green))]" />
                </div>
                
                {/* Content card */}
                <div className="flex-1 p-5 rounded-xl border border-pen-border-soft bg-pen-surface1 hover:border-pen-brand/30 hover:shadow-[0_0_20px_hsl(var(--color-brand-primary)_/_0.1)] transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <step.icon className="h-5 w-5 text-pen-brand group-hover:text-terminal-green transition-colors" />
                      <h3 className="font-heading text-lg font-semibold text-pen-text-primary">{step.title}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-pen-surface2 border border-pen-border-soft">
                      <Zap className="h-3 w-3 text-terminal-green" />
                      <span className="text-xs font-mono text-pen-text-muted">{step.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-pen-text-muted leading-relaxed">{step.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-terminal-green/30 bg-terminal-green/10 text-terminal-green font-mono text-sm">
            <span className="animate-pulse">$</span> Ready to start?
            <ArrowRight className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
