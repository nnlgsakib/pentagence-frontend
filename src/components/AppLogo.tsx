import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function AppLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-pen-brand/10 border border-pen-brand/20 group-hover:border-pen-brand/40 transition-colors">
        <Shield className="h-4 w-4 text-pen-brand" />
        <div className="absolute inset-0 rounded-lg bg-pen-brand/5 animate-pulse-ring pointer-events-none" />
      </div>
      {!collapsed && (
        <span className="font-heading text-lg font-bold tracking-tight text-foreground">
          Penta<span className="text-pen-brand">gence</span>
        </span>
      )}
    </Link>
  );
}
