import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  className?: string;
}

export function StatCard({ label, value, change, changeType = "neutral", icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn(
      "rounded-lg border border-pen-border-soft bg-card p-5 shadow-pen-sm transition-all hover:border-pen-border-strong hover:shadow-pen-md",
      className
    )}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-pen-text-muted">{label}</span>
        <Icon className="h-4 w-4 text-pen-text-muted" />
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-heading font-bold text-foreground">{value}</span>
        {change && (
          <span className={cn(
            "text-xs font-medium",
            changeType === "positive" && "text-pen-success",
            changeType === "negative" && "text-pen-danger",
            changeType === "neutral" && "text-pen-text-muted",
          )}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
