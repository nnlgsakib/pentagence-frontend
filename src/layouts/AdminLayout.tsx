import { Outlet, Link, useLocation } from "react-router-dom";
import { AppLogo } from "@/components/AppLogo";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Users, Play, Cpu, Server, ListOrdered,
  Activity, ScrollText, Settings, ChevronLeft, ChevronRight, LogOut, Menu, ArrowLeft
} from "lucide-react";
import { useState } from "react";

const adminNav = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Sessions", href: "/admin/sessions", icon: Play },
  { label: "Workers", href: "/admin/workers", icon: Cpu },
  { label: "Clusters", href: "/admin/clusters", icon: Server },
  { label: "Queue", href: "/admin/queue", icon: ListOrdered },
  { label: "System", href: "/admin/system", icon: Activity },
  { label: "Audit Log", href: "/admin/audit", icon: ScrollText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-between border-b border-pen-border-soft">
        <AppLogo collapsed={collapsed} />
        <button onClick={() => setCollapsed(!collapsed)} className="hidden md:flex h-6 w-6 items-center justify-center rounded text-pen-text-muted hover:text-foreground hover:bg-pen-elevated transition-colors">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="p-3">
        <Link to="/app" className="flex items-center gap-2 px-3 py-1.5 text-xs text-pen-text-muted hover:text-foreground transition-colors">
          <ArrowLeft className="h-3 w-3" />
          {!collapsed && "Back to App"}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {!collapsed && <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-pen-text-muted">Administration</span>}
        {adminNav.map((item) => (
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

      <div className="p-3 border-t border-pen-border-soft">
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-pen-text-muted hover:text-pen-danger hover:bg-pen-danger/5 transition-colors">
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <aside className={`hidden md:flex flex-col border-r border-pen-border-soft bg-pen-surface1 transition-all duration-200 ${collapsed ? "w-16" : "w-60"}`}>
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-pen-base/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-pen-surface1 border-r border-pen-border-soft">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-pen-border-soft bg-pen-surface1/50 backdrop-blur-sm flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1.5 text-pen-text-muted hover:text-foreground" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-xs font-mono text-pen-warning bg-pen-warning/10 px-2 py-0.5 rounded">ADMIN</span>
          </div>
          <span className="text-sm text-pen-text-muted">admin@pentagence.io</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
