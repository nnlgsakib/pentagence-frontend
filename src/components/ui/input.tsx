import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-pen-border-soft bg-pen-surface1 px-3 py-2 text-sm text-pen-text-primary ring-offset-pen-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-pen-text-primary placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50 focus:border-pen-brand/50 focus:shadow-[0_0_10px_hsl(var(--color-brand-primary)_/_0.15)] disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

// Terminal-style input variant
const InputTerminal = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-sm border border-pen-border-soft bg-pen-terminal px-3 py-1.5 text-sm font-mono text-terminal-green ring-offset-pen-base file:border-0 file:bg-transparent file:text-sm file:font-mono file:text-terminal-green placeholder:text-pen-text-muted/60 focus:outline-none focus:ring-1 focus:ring-terminal-green/50 focus:border-terminal-green/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
InputTerminal.displayName = "InputTerminal";

export { Input, InputTerminal };
