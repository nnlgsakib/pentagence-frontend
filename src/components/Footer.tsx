import { Link } from "react-router-dom";
import { AppLogo } from "@/components/AppLogo";

export function Footer() {
  return (
    <footer className="border-t border-pen-border-soft bg-pen-surface1">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <AppLogo />
            <p className="mt-3 text-sm text-pen-text-muted">Agentic pentesting at scale.</p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground mb-3">Product</h4>
            <div className="space-y-2">
              <Link to="/features" className="block text-sm text-pen-text-muted hover:text-foreground transition-colors">Features</Link>
              <Link to="/how-it-works" className="block text-sm text-pen-text-muted hover:text-foreground transition-colors">How It Works</Link>
              <Link to="/security" className="block text-sm text-pen-text-muted hover:text-foreground transition-colors">Security</Link>
              <Link to="/pricing" className="block text-sm text-pen-text-muted hover:text-foreground transition-colors">Pricing</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground mb-3">Resources</h4>
            <div className="space-y-2">
              <Link to="/docs" className="block text-sm text-pen-text-muted hover:text-foreground transition-colors">Documentation</Link>
              <Link to="/contact" className="block text-sm text-pen-text-muted hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground mb-3">Legal</h4>
            <div className="space-y-2">
              <span className="block text-sm text-pen-text-muted">Privacy Policy</span>
              <span className="block text-sm text-pen-text-muted">Terms of Service</span>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-pen-border-soft text-center text-xs text-pen-text-muted">
          © 2026 Pentagence. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
