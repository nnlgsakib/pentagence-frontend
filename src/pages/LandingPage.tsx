import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/StatusPill";
import { Shield, Zap, Eye, Lock, ArrowRight, ChevronRight, Play } from "lucide-react";
import { motion } from "framer-motion";

const logLines = [
  { level: "info", msg: "Temporal is ready; execution pipeline initialized" },
  { level: "info", msg: "Cloning target repository: acme-frontend" },
  { level: "info", msg: "Shannon agent initialized — reconnaissance phase" },
  { level: "warn", msg: "Detected injection point at /api/search?q=" },
  { level: "error", msg: "HIGH: Reflected XSS in /search endpoint" },
  { level: "info", msg: "Generating pentest report artifacts..." },
];

const steps = [
  { num: "01", title: "Submit Target", desc: "Provide a git repo and live URL to initiate a pentest session." },
  { num: "02", title: "Agent Orchestration", desc: "Shannon deploys recon, SAST, and DAST agents in parallel." },
  { num: "03", title: "Realtime Monitoring", desc: "Stream logs, track progress, and observe findings as they appear." },
  { num: "04", title: "Actionable Report", desc: "Get a prioritized report with evidence and remediation guidance." },
];

const credibility = [
  { icon: Lock, label: "Sandbox Isolation", desc: "Every session runs in an ephemeral, isolated environment." },
  { icon: Eye, label: "Full Observability", desc: "Realtime logs, audit trails, and artifact capture." },
  { icon: Shield, label: "RBAC Controls", desc: "Role-based access with admin and user boundaries." },
  { icon: Zap, label: "Agentic Execution", desc: "AI-driven pentesting with human-in-the-loop oversight." },
];

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Grid bg */}
        <div className="absolute inset-0 animate-grid-drift opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(hsl(var(--color-brand-primary) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--color-brand-primary) / 0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        {/* Scanline */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-pen-brand/30 to-transparent animate-scanline" />
        </div>
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-pen-brand/8 blur-[150px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] rounded-full bg-pen-accent/6 blur-[120px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-pen-border-soft bg-pen-surface1/50 px-3 py-1 text-xs text-pen-text-secondary mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-pen-accent animate-pulse" />
                Now in private beta
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6">
                Agentic Pentesting{" "}
                <span className="text-pen-brand">at Scale</span>
              </h1>
              <p className="text-lg text-pen-text-secondary max-w-lg mb-8">
                Pentagence orchestrates AI-driven security agents to test your applications continuously. 
                Submit a target, get findings — no manual setup required.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/auth/register">
                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/how-it-works">
                    See How It Works
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Command stream panel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              <div className="rounded-xl border border-pen-border-soft bg-pen-surface1/80 backdrop-blur-sm shadow-pen-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-pen-border-soft">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-pen-danger/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-pen-warning/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-pen-success/60" />
                  </div>
                  <span className="text-xs text-pen-text-muted font-mono ml-2">pentagence session — live</span>
                  <StatusPill status="running" className="ml-auto text-[10px]">running</StatusPill>
                </div>
                <div className="p-4 font-mono text-xs space-y-1.5 max-h-72 overflow-hidden">
                  {logLines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.4 }}
                      className="flex gap-2"
                    >
                      <span className={`shrink-0 ${
                        line.level === "error" ? "text-pen-danger" :
                        line.level === "warn" ? "text-pen-warning" :
                        "text-pen-text-muted"
                      }`}>
                        [{line.level.toUpperCase().padEnd(5)}]
                      </span>
                      <span className="text-pen-text-secondary">{line.msg}</span>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 3 }}
                    className="text-pen-brand"
                  >
                    █
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Credibility strip */}
      <section className="border-y border-pen-border-soft bg-pen-surface1/30">
        <div className="container mx-auto px-4 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {credibility.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-lg border border-pen-border-soft/50 bg-pen-surface1/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pen-brand/10 text-pen-brand">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-foreground">{item.label}</h3>
                  <p className="text-xs text-pen-text-muted mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-pen-text-secondary max-w-lg mx-auto">From target submission to actionable report in minutes, fully automated.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative p-6 rounded-xl border border-pen-border-soft bg-pen-surface1/50 group hover:border-pen-brand/30 transition-colors"
              >
                <span className="font-heading text-3xl font-bold text-pen-brand/20 group-hover:text-pen-brand/40 transition-colors">{step.num}</span>
                <h3 className="font-heading text-base font-semibold text-foreground mt-3 mb-2">{step.title}</h3>
                <p className="text-sm text-pen-text-muted">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-pen-border-strong z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-t border-pen-border-soft bg-pen-surface1/20">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-12">Trusted by Security Teams</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { quote: "Pentagence cut our pentest cycle from weeks to hours. The AI agents find real vulnerabilities.", author: "Sarah Chen", role: "CISO, Acme Corp" },
              { quote: "The realtime log streaming gives us confidence that nothing is missed during execution.", author: "Marcus Rivera", role: "Security Lead, FinTech Inc" },
              { quote: "Finally, a tool that treats pentesting as a continuous process, not a one-time audit.", author: "Aisha Patel", role: "VP Engineering, DataFlow" },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 rounded-xl border border-pen-border-soft bg-pen-surface1/50"
              >
                <p className="text-sm text-pen-text-secondary italic mb-4">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.author}</p>
                  <p className="text-xs text-pen-text-muted">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">Ready to automate your security testing?</h2>
          <p className="text-pen-text-secondary max-w-md mx-auto mb-8">Start a free trial and run your first pentest session in minutes.</p>
          <div className="flex justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/auth/register">
                <Play className="mr-2 h-4 w-4" /> Start Free Trial
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
