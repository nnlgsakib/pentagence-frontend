import { Link, useLocation } from "react-router-dom";
import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X } from "lucide-react";
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-pen-border-soft bg-pen-base/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <AppLogo />
        
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === link.href
                  ? "text-foreground bg-pen-elevated"
                  : "text-pen-text-secondary hover:text-foreground hover:bg-pen-elevated/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button asChild size="sm">
              <Link to="/app">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-pen-text-secondary" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-pen-border-soft bg-pen-surface1 p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm text-pen-text-secondary hover:text-foreground rounded-md hover:bg-pen-elevated/50"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-pen-border-soft flex gap-2">
            <Button variant="ghost" size="sm" asChild className="flex-1">
              <Link to="/auth/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild className="flex-1">
              <Link to="/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
