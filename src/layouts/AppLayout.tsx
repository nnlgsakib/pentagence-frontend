import { Outlet, Link, useLocation } from "react-router-dom";
import { AppLogo } from "@/components/AppLogo";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Play, Search, FileText, Settings, CreditCard,
  User, Shield, Key, ChevronLeft, ChevronRight, LogOut, Menu
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/StatusPill";

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
  const { logout, role } = useAuth();

  const isActive = (href: string) => {
    if (href === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-between border-b border-pen-border-soft">
        <AppLogo collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex h-6 w-6 items-center justify-center rounded text-pen-text-muted hover:text-foreground hover:bg-pen-elevated transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {!collapsed && <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-pen-text-muted">Main</span>}
        {appNav.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive(item.href)
                ? "bg-pen-brand/10 text-pen-brand border border-pen-brand/20"
                : "text-pen-text-secondary hover:text-foreground hover:bg-pen-elevated/50 border border-transparent"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}

        <div className="pt-4">
          {!collapsed && <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-pen-text-muted">Settings</span>}
          {settingsNav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-pen-brand/10 text-pen-brand border border-pen-brand/20"
                  : "text-pen-text-secondary hover:text-foreground hover:bg-pen-elevated/50 border border-transparent"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>

        {role === "admin" && (
          <div className="pt-4">
            {!collapsed && <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-pen-text-muted">Admin</span>}
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-pen-text-secondary hover:text-foreground hover:bg-pen-elevated/50 border border-transparent"
            >
              <Settings className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Admin Panel</span>}
            </Link>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-pen-border-soft">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-pen-text-muted hover:text-pen-danger hover:bg-pen-danger/5 transition-colors"
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
          <div className="absolute inset-0 bg-pen-base/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-pen-surface1 border-r border-pen-border-soft">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-pen-border-soft bg-pen-surface1/50 backdrop-blur-sm flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1.5 text-pen-text-muted hover:text-foreground" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <StatusPill status="running">1 session running</StatusPill>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-pen-text-muted">
            <span className="hidden sm:inline">demo@pentagence.io</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
