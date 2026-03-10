import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_15px_hsl(var(--color-brand-primary)_/_0.3)] active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-[0_0_15px_hsl(var(--color-danger)_/_0.3)] active:scale-[0.98]",
        outline: "border border-pen-border-soft bg-transparent hover:bg-pen-surface2 hover:border-pen-brand/50 hover:text-pen-brand hover:shadow-[0_0_10px_hsl(var(--color-brand-primary)_/_0.2)]",
        secondary: "bg-pen-surface2 text-pen-text-primary hover:bg-pen-elevated border border-pen-border-soft",
        ghost: "hover:bg-pen-surface2 hover:text-pen-text-primary",
        link: "text-pen-brand underline-offset-4 hover:underline hover:text-pen-brand-hover",
        // Terminal-style variants
        terminal: "bg-pen-terminal border border-pen-border-soft text-terminal-green hover:bg-pen-surface2 hover:border-terminal-green/50 hover:shadow-[0_0_10px_hsl(var(--color-terminal-green)_/_0.2)] font-mono",
        neon: "bg-transparent border border-pen-brand text-pen-brand hover:bg-pen-brand/10 hover:border-pen-brand hover:shadow-[0_0_20px_hsl(var(--color-brand-primary)_/_0.4)] animate-pulse-ring",
        danger: "bg-pen-danger/10 border border-pen-danger/30 text-pen-danger hover:bg-pen-danger/20 hover:border-pen-danger/50 hover:shadow-[0_0_10px_hsl(var(--color-danger)_/_0.2)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        "sm-terminal": "h-8 px-3 text-xs font-mono",
        "lg-terminal": "h-12 px-6 text-base font-mono",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
