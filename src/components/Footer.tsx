import { Link } from "react-router-dom";
import { AppLogo } from "@/components/AppLogo";
import { Terminal, Shield, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-pen-border-soft/50 bg-pen-surface1/50">
      {/* Glow line */}
      <div className="h-px bg-gradient-to-r from-transparent via-pen-border-soft to-transparent" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <AppLogo />
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-terminal-green/10 border border-terminal-green/20">
                <Terminal className="h-3 w-3 text-terminal-green" />
                <span className="text-[10px] font-mono text-terminal-green">v2.4.1</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-pen-text-muted">Agentic pentesting at scale.</p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="text-pen-text-muted hover:text-terminal-green transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="text-pen-text-muted hover:text-pen-brand transition-colors">
                <Shield className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold text-pen-text-primary mb-3">Product</h4>
            <div className="space-y-2">
              <Link to="/features" className="block text-sm text-pen-text-muted hover:text-pen-text-primary transition-colors">Features</Link>
              <Link to="/how-it-works" className="block text-sm text-pen-text-muted hover:text-pen-text-primary transition-colors">How It Works</Link>
              <Link to="/security" className="block text-sm text-pen-text-muted hover:text-pen-text-primary transition-colors">Security</Link>
              <Link to="/pricing" className="block text-sm text-pen-text-muted hover:text-pen-text-primary transition-colors">Pricing</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold text-pen-text-primary mb-3">Resources</h4>
            <div className="space-y-2">
              <Link to="/docs" className="block text-sm text-pen-text-muted hover:text-pen-text-primary transition-colors">Documentation</Link>
              <Link to="/contact" className="block text-sm text-pen-text-muted hover:text-pen-text-primary transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold text-pen-text-primary mb-3">Legal</h4>
            <div className="space-y-2">
              <span className="block text-sm text-pen-text-muted cursor-pointer hover:text-pen-text-primary transition-colors">Privacy Policy</span>
              <span className="block text-sm text-pen-text-muted cursor-pointer hover:text-pen-text-primary transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-pen-border-soft/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-pen-text-muted font-mono">
            <span className="text-terminal-green">©</span> 2026 Pentagence Systems. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs text-pen-text-muted">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse" />
              Systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
