import { motion } from "framer-motion";

const steps = [
  { phase: "Target Submission", detail: "Define your target by providing a git repository URL and a live application endpoint. Configure scan depth, agent types, and notification preferences.", time: "~30 seconds" },
  { phase: "Agent Provisioning", detail: "Pentagence spins up an isolated sandbox and deploys Shannon-based agents. Each agent specializes in a domain: recon, SAST, DAST, or API testing.", time: "~1 minute" },
  { phase: "Execution & Discovery", detail: "Agents work in parallel, sharing context via a shared intelligence graph. Findings are validated and de-duplicated in realtime.", time: "5-30 minutes" },
  { phase: "Report Generation", detail: "All findings are consolidated into a structured report with severity ratings, evidence, and remediation guidance. Export as PDF or JSON.", time: "~2 minutes" },
];

export default function HowItWorksPage() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">How Pentagence Works</h1>
          <p className="text-pen-text-secondary max-w-lg mx-auto">A fully automated lifecycle from target to findings.</p>
        </div>
        <div className="max-w-2xl mx-auto space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.phase}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative pl-8 pb-12 last:pb-0 border-l border-pen-border-soft"
            >
              <div className="absolute left-0 top-0 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-pen-brand bg-pen-base" />
              <span className="text-xs text-pen-brand font-mono">{step.time}</span>
              <h3 className="font-heading text-lg font-semibold text-foreground mt-1 mb-2">{step.phase}</h3>
              <p className="text-sm text-pen-text-muted">{step.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
