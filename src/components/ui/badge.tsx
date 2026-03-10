import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-pen-brand/30 bg-pen-brand/10 text-pen-brand",
        secondary: "border-pen-border-soft bg-pen-surface2 text-pen-text-secondary",
        destructive: "border-pen-danger/30 bg-pen-danger/10 text-pen-danger",
        outline: "border-pen-border-soft text-pen-text-secondary",
        success: "border-terminal-green/30 bg-terminal-green/10 text-terminal-green",
        warning: "border-pen-warning/30 bg-pen-warning/10 text-pen-warning",
        info: "border-pen-info/30 bg-pen-info/10 text-pen-info",
        terminal: "border-pen-border-soft bg-pen-terminal text-terminal-green font-mono",
        neon: "border-pen-brand bg-transparent text-pen-brand shadow-[0_0_8px_hsl(var(--color-brand-primary)_/_0.3)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
