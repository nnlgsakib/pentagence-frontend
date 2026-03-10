import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Eye, Lock, ArrowRight, Play, Terminal, Cpu, Scan, Skull } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const terminalLogs = [
  { type: "system", msg: "Initializing Pentagence kernel v2.4.1...", delay: 0 },
  { type: "info", msg: "Loading Shannon pentest engine...", delay: 400 },
  { type: "success", msg: "Neural threat scanner ready", delay: 800 },
  { type: "info", msg: "Cloning target: github.com/acme/secure-app", delay: 1200 },
  { type: "info", msg: "Deploying isolation containers...", delay: 1800 },
  { type: "warning", msg: "Detected: Weak TLS configuration", delay: 2600 },
  { type: "warning", msg: "Detected: SQL injection vector in /api/users", delay: 3200 },
  { type: "error", msg: "CRITICAL: Unauthenticated API endpoint /admin", delay: 4000 },
  { type: "info", msg: "Running exploitation modules...", delay: 4800 },
  { type: "success", msg: "Exfiltrated proof-of-concept: XSS payload", delay: 5600 },
  { type: "info", msg: "Generating vulnerability report...", delay: 6400 },
  { type: "success", msg: "Pentest complete: 47 findings (12 critical)", delay: 7200 },
];

const steps = [
  { 
    num: "01", 
    title: "Deploy Target", 
    desc: "Submit your GitHub repo and live URL. We spin up isolated assessment containers in seconds.",
    icon: Terminal
  },
  { 
    num: "02", 
    title: "AI Defensive Ops", 
    desc: "Shannon agents execute recon, vulnerability assessment, and threat detection in parallel — no manual scripting.",
    icon: Skull
  },
  { 
    num: "03", 
    title: "Live Intel Stream", 
    desc: "Watch findings appear in real-time. Every vulnerability captured with proof and remediation.",
    icon: Scan
  },
  { 
    num: "04", 
    title: "Actionable Report", 
    desc: "Get a prioritized findings report with CVSS scores, PoC evidence, and fix recommendations.",
    icon: Cpu
  },
];

const features = [
  { 
    icon: Lock, 
    label: "Ephemeral Isolation", 
    desc: "Every pentest runs in firewalled containers. Zero blast radius.",
    glow: "hover:shadow-[0_0_20px_hsl(var(--color-terminal-green)_/_0.2)]"
  },
  { 
    icon: Eye, 
    label: "Total Observability", 
    desc: "Full audit logs, session replay, and artifact capture. Nothing hidden.",
    glow: "hover:shadow-[0_0_20px_hsl(var(--color-brand-primary)_/_0.2)]"
  },
  { 
    icon: Shield, 
    label: "Enterprise RBAC", 
    desc: "Granular permissions, SSO integration, and compliance reporting built-in.",
    glow: "hover:shadow-[0_0_20px_hsl(var(--color-terminal-cyan)_/_0.2)]"
  },
  { 
    icon: Zap, 
    label: "Autonomous Agents", 
    desc: "AI-driven testing that learns your stack and finds what matters.",
    glow: "hover:shadow-[0_0_20px_hsl(var(--color-terminal-yellow)_/_0.2)]"
  },
];

const stats = [
  { value: "50K+", label: "Vulnerabilities Found" },
  { value: "12s", label: "Avg. Assessment Time" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24/7", label: "Autonomous Ops" },
];

export default function LandingPage() {
  const [visibleLogs, setVisibleLogs] = useState<number[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    terminalLogs.forEach((log, index) => {
      const timer = setTimeout(() => {
        setVisibleLogs(prev => [...prev, index]);
      }, log.delay);
      timers.push(timer);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Animated background layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Main grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--color-brand-primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--color-brand-primary)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'grid-drift 30s ease-in-out infinite'
          }} 
        />
        
        {/* Glow zones */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-pen-brand/5 blur-[180px] animate-glow-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-terminal-green/5 blur-[150px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-pen-secondary/5 blur-[120px] animate-glow-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Scanline effect */}
        <div className="absolute inset-0 opacity-[0.015] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,hsl(var(--color-brand-primary))_2px,hsl(var(--color-brand-primary))_4px)]" />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--color-bg-base))_100%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden z-10">
        <div className="container px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Hero content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-terminal-green/30 bg-terminal-green/5 px-4 py-1.5 mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-terminal-green"></span>
                </span>
                <span className="text-xs font-mono text-terminal-green tracking-wider">SYSTEMS ONLINE</span>
              </motion.div>

              {/* Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] mb-6"
              >
                <span className="text-pen-text-primary">Automated </span>
                <br />
                <span className="bg-gradient-to-r from-pen-brand via-terminal-cyan to-terminal-green bg-clip-text text-transparent">
                  Defensive Security
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg sm:text-xl text-pen-text-secondary max-w-lg mb-10 leading-relaxed"
              >
                Deploy AI-powered penetration testing agents against your infrastructure. 
                Continuous, autonomous, and governed by your policies.
              </motion.p>

              {/* CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Button size="lg" variant="default" className="gap-2 text-base px-8" asChild>
                  <Link to="/auth/register">
                    <Play className="h-4 w-4" /> Start Assessment
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 text-base border-pen-border-strong hover:border-pen-brand/50" asChild>
                  <Link to="/how-it-works">
                    View Demo <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>

              {/* Stats row */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="grid grid-cols-4 gap-6 mt-16 pt-8 border-t border-pen-border-soft"
              >
                {stats.map((stat, i) => (
                  <div key={stat.label}>
                    <div className="text-2xl sm:text-3xl font-heading font-bold text-terminal-green mb-1">{stat.value}</div>
                    <div className="text-xs text-pen-text-muted uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Terminal panel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* Glow behind terminal */}
              <div className="absolute -inset-4 bg-gradient-to-r from-pen-brand/20 via-terminal-green/10 to-pen-brand/20 rounded-2xl blur-2xl opacity-50" />
              
              {/* Terminal */}
              <div className="relative rounded-xl border border-pen-border-soft bg-pen-terminal/90 backdrop-blur-sm overflow-hidden shadow-2xl">
                {/* Terminal header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-pen-border-soft bg-pen-surface2/50">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-pen-danger/80" />
                      <div className="w-3 h-3 rounded-full bg-pen-warning/80" />
                      <div className="w-3 h-3 rounded-full bg-terminal-green/80" />
                    </div>
                    <span className="text-xs text-pen-text-muted font-mono ml-2">pentagence://assessment</span>
                  </div>
                  <Badge variant="terminal" className="text-[10px]">LIVE</Badge>
                </div>

                {/* Terminal content */}
                <div className="p-4 font-mono text-xs sm:text-sm min-h-[340px] max-h-[400px] overflow-hidden">
                  <AnimatePresence>
                    {terminalLogs.map((log, index) => (
                      visibleLogs.includes(index) && (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex gap-2 mb-1.5"
                        >
                          <span className={`shrink-0 ${
                            log.type === 'error' ? 'text-pen-danger' :
                            log.type === 'warning' ? 'text-pen-warning' :
                            log.type === 'success' ? 'text-terminal-green' :
                            'text-pen-text-muted'
                          }`}>
                            {log.type === 'system' ? '◆' :
                             log.type === 'success' ? '✓' :
                             log.type === 'error' ? '✗' :
                             log.type === 'warning' ? '⚠' : '›'}
                          </span>
                          <span className="text-pen-text-secondary">{log.msg}</span>
                        </motion.div>
                      )
                    ))}
                  </AnimatePresence>
                  {visibleLogs.length === terminalLogs.length && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: cursorVisible ? 1 : 0 }}
                      className="text-terminal-green"
                    >
                      <span className="animate-pulse">▋</span>
                    </motion.div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="px-4 pb-3">
                  <div className="flex items-center justify-between text-[10px] text-pen-text-muted mb-1.5">
                    <span>Assessment Progress</span>
                    <span>{Math.round((visibleLogs.length / terminalLogs.length) * 100)}%</span>
                  </div>
                  <div className="h-1 bg-pen-surface2 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-pen-brand to-terminal-green"
                      initial={{ width: 0 }}
                      animate={{ width: `${(visibleLogs.length / terminalLogs.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -right-4 top-10"
              >
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-pen-brand/30 bg-pen-brand/10 backdrop-blur-sm shadow-[0_0_15px_hsl(var(--color-brand-primary)_/_0.2)]">
                  <Zap className="h-4 w-4 text-pen-brand" />
                  <span className="text-xs font-mono text-pen-brand">47 Findings</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute -left-4 bottom-20"
              >
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-terminal-green/30 bg-terminal-green/10 backdrop-blur-sm shadow-[0_0_15px_hsl(var(--color-terminal-green)_/_0.2)]">
                  <Shield className="h-4 w-4 text-terminal-green" />
                  <span className="text-xs font-mono text-terminal-green">12 Critical</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="relative py-12 border-y border-pen-border-soft bg-pen-surface1/30 z-10">
        <div className="container px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`flex items-start gap-3 p-4 rounded-lg border border-pen-border-soft/50 bg-pen-surface1/50 transition-all ${feature.glow}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-pen-surface2 border border-pen-border-soft">
                  <feature.icon className="h-5 w-5 text-pen-brand" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-pen-text-primary mb-1">{feature.label}</h3>
                  <p className="text-xs text-pen-text-muted leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-32 z-10">
        <div className="container px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge variant="outline" className="mb-4 border-terminal-green/30 text-terminal-green">WORKFLOW</Badge>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-pen-text-primary mb-6">
              From Deploy to <span className="text-terminal-green">Report</span>
            </h2>
            <p className="text-pen-text-secondary max-w-2xl mx-auto text-lg">
              Four steps from target submission to actionable security intelligence.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative group"
              >
                <div className="p-6 rounded-xl border border-pen-border-soft bg-pen-surface1/50 backdrop-blur-sm h-full transition-all group-hover:border-pen-brand/30 group-hover:bg-pen-surface2/50">
                  {/* Step number */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-3xl font-bold text-pen-brand/20 group-hover:text-pen-brand/40 transition-colors">
                      {step.num}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pen-brand/10 border border-pen-brand/20">
                      <step.icon className="h-5 w-5 text-pen-brand" />
                    </div>
                  </div>
                  
                  <h3 className="font-heading text-lg font-semibold text-pen-text-primary mb-2">{step.title}</h3>
                  <p className="text-sm text-pen-text-muted leading-relaxed">{step.desc}</p>

                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-pen-border-soft to-transparent" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 z-10">
        <div className="container px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border border-pen-border-soft bg-pen-surface1/50 overflow-hidden"
          >
            {/* Background effects */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-pen-brand/10 blur-[150px]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--color-bg-base))_70%)]" />
            </div>

            <div className="relative px-8 py-20 text-center">
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-pen-text-primary mb-6">
                Ready to <span className="text-terminal-green">Breach</span> Your Defenses?
              </h2>
              <p className="text-pen-text-secondary max-w-2xl mx-auto mb-10 text-lg">
                Join security teams who use Pentagence to find vulnerabilities before the bad guys do.
                Start your first autonomous assessment in minutes.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2 text-base px-8" asChild>
                  <Link to="/auth/register">
                    <Zap className="h-4 w-4" /> Launch Assessment
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 text-base" asChild>
                  <Link to="/contact">Talk to Sales</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
