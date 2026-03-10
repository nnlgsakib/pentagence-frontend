import { Outlet, Link, useLocation } from "react-router-dom";
import { AppLogo } from "@/components/AppLogo";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Play, Search, FileText, Settings, CreditCard,
  User, Shield, Key, ChevronLeft, ChevronRight, LogOut, Menu, Terminal
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/StatusPill";
import { Badge } from "@/components/ui/badge";

const appNav = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Sessions", href: "/app/sessions", icon: Play },
  { label: "Findings", href: "/app/findings", icon: Search },
  { label: "Reports", href: "/app/reports", icon: FileText },
];

const settingsNav = [
  { label: "Profile", href: "/app/settings/profile", icon: User },
  { label: "Security", href: "/app/settings/security", icon: Shield },
  { label: "API Keys", href: "/app/settings/api-keys", icon: Key },
  { label: "Billing", href: "/app/billing", icon: CreditCard },
];

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { logout, role, user } = useAuth();

  const isActive = (href: string) => {
    if (href === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-pen-surface1">
      <div className="p-4 flex items-center justify-between border-b border-pen-border-soft/50">
        <AppLogo collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex h-6 w-6 items-center justify-center rounded text-pen-text-muted hover:text-pen-text-primary hover:bg-pen-surface2 transition-all"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 mb-2">
            <Terminal className="h-3 w-3 text-terminal-green" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-pen-text-muted">Workspace</span>
          </div>
        )}
        {appNav.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              isActive(item.href)
                ? "bg-pen-brand/10 text-pen-brand border border-pen-brand/30 shadow-[0_0_10px_hsl(var(--color-brand-primary)_/_0.1)]"
                : "text-pen-text-secondary hover:text-pen-text-primary hover:bg-pen-surface2 border border-transparent"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}

        <div className="pt-4">
          {!collapsed && (
            <div className="flex items-center gap-2 px-3 mb-2">
              <Settings className="h-3 w-3 text-pen-text-muted" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-pen-text-muted">Settings</span>
            </div>
          )}
          {settingsNav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive(item.href)
                  ? "bg-pen-brand/10 text-pen-brand border border-pen-brand/30"
                  : "text-pen-text-secondary hover:text-pen-text-primary hover:bg-pen-surface2 border border-transparent"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>

        {role === "admin" && (
          <div className="pt-4">
            {!collapsed && (
              <div className="flex items-center gap-2 px-3 mb-2">
                <Shield className="h-3 w-3 text-pen-warning" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-pen-text-muted">Admin</span>
              </div>
            )}
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-pen-text-secondary hover:text-pen-text-primary hover:bg-pen-surface2 border border-transparent transition-all"
            >
              <Settings className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Admin Panel</span>}
            </Link>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-pen-border-soft/50">
        <button
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-pen-text-muted hover:text-pen-danger hover:bg-pen-danger/5 transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col border-r border-pen-border-soft bg-pen-surface1 transition-all duration-200 ${collapsed ? "w-16" : "w-60"}`}>
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-pen-base/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-pen-surface1 border-r border-pen-border-soft">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-pen-border-soft/50 bg-pen-surface1/50 backdrop-blur-sm flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1.5 text-pen-text-muted hover:text-pen-text-primary" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <Badge variant="terminal" className="text-[10px]">1 session running</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pen-surface2 border border-pen-border-soft">
              <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
              <span className="text-pen-text-muted font-mono text-xs">{user?.email || "unknown-user"}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-pen-base">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
