import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const statusPillVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors",
  {
    variants: {
      status: {
        queued: "bg-pen-info/10 text-pen-info border-pen-info/20",
        provisioning: "bg-pen-warning/10 text-pen-warning border-pen-warning/20",
        running: "bg-pen-brand/10 text-pen-brand border-pen-brand/20",
        finalizing: "bg-pen-accent/10 text-pen-accent border-pen-accent/20",
        completed: "bg-pen-success/10 text-pen-success border-pen-success/20",
        failed: "bg-pen-danger/10 text-pen-danger border-pen-danger/20",
        canceled: "bg-pen-text-muted/10 text-pen-text-muted border-pen-text-muted/20",
      },
    },
    defaultVariants: {
      status: "queued",
    },
  }
);

interface StatusPillProps extends VariantProps<typeof statusPillVariants> {
  className?: string;
  children?: React.ReactNode;
}

const StatusPill = forwardRef<HTMLSpanElement, StatusPillProps>(
  ({ status, className, children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(statusPillVariants({ status }), className)} {...props}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {children || status}
      </span>
    );
  }
);
StatusPill.displayName = "StatusPill";

export { StatusPill, statusPillVariants };
