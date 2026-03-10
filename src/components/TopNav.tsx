import { Link, useLocation } from "react-router-dom";
import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, Terminal } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Security", href: "/security" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Contact", href: "/contact" },
];

export function TopNav() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-pen-border-soft/50 bg-pen-base/90 backdrop-blur-xl">
      {/* Glow line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pen-brand/50 to-transparent" />
      
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <AppLogo />
            {/* Status indicator */}
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-terminal-green animate-pulse shadow-[0_0_6px_hsl(var(--color-terminal-green))]" />
          </div>
        </div>
        
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                location.pathname === link.href
                  ? "text-pen-brand bg-pen-brand/10 border border-pen-brand/20 shadow-[0_0_10px_hsl(var(--color-brand-primary)_/_0.15)]"
                  : "text-pen-text-secondary hover:text-pen-text-primary hover:bg-pen-surface2 border border-transparent"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button asChild size="sm" variant="default">
              <Link to="/app">
                <Terminal className="h-3 w-3 mr-1.5" /> Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth/login">Sign In</Link>
              </Button>
              <Button size="sm" variant="default" asChild>
                <Link to="/auth/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-pen-text-secondary hover:text-pen-text-primary" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-pen-border-soft/50 bg-pen-surface1/95 backdrop-blur-xl p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-pen-text-secondary hover:text-pen-text-primary rounded-md hover:bg-pen-surface2 border border-transparent hover:border-pen-border-soft transition-all"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-pen-border-soft flex gap-2">
            {isAuthenticated ? (
              <Button size="sm" asChild className="flex-1">
                <Link to="/app">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="flex-1">
                  <Link to="/auth/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="flex-1">
                  <Link to="/auth/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
