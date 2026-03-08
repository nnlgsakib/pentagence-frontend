import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, AlertCircle, Info, ChevronDown } from "lucide-react";
import { forwardRef } from "react";

const severityBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold",
  {
    variants: {
      severity: {
        critical: "bg-pen-danger/15 text-pen-danger",
        high: "bg-pen-warning/15 text-pen-warning",
        medium: "bg-pen-brand/15 text-pen-brand",
        low: "bg-pen-accent/15 text-pen-accent",
        info: "bg-pen-text-muted/15 text-pen-text-muted",
      },
    },
    defaultVariants: {
      severity: "info",
    },
  }
);

const severityIcons = {
  critical: Shield,
  high: AlertTriangle,
  medium: AlertCircle,
  low: ChevronDown,
  info: Info,
};

interface SeverityBadgeProps extends VariantProps<typeof severityBadgeVariants> {
  className?: string;
}

const SeverityBadge = forwardRef<HTMLSpanElement, SeverityBadgeProps>(
  ({ severity, className, ...props }, ref) => {
    const Icon = severityIcons[severity || "info"];
    return (
      <span ref={ref} className={cn(severityBadgeVariants({ severity }), className)} {...props}>
        <Icon className="h-3 w-3" />
        {severity}
      </span>
    );
  }
);
SeverityBadge.displayName = "SeverityBadge";

export { SeverityBadge };
