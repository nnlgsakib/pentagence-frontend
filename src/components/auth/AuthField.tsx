import { ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string | null;
  icon?: ReactNode;
  trailing?: ReactNode;
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(function AuthField(
  { label, hint, error, icon, trailing, className, ...props },
  ref,
) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <div
        className={cn(
          "group flex items-center rounded-2xl border bg-pen-surface2/90 px-4 shadow-sm transition-all duration-200",
          error
            ? "border-pen-danger/60 ring-4 ring-pen-danger/10"
            : "border-pen-border-soft hover:border-pen-border-strong focus-within:border-pen-brand focus-within:ring-4 focus-within:ring-pen-brand/10",
        )}
      >
        {icon ? <span className="mr-3 text-pen-text-muted transition-colors group-focus-within:text-pen-brand">{icon}</span> : null}
        <input
          ref={ref}
          className={cn(
            "min-h-[54px] w-full bg-transparent text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none",
            trailing ? "pr-3" : "",
            className,
          )}
          {...props}
        />
        {trailing ? <span className="ml-2 flex shrink-0 items-center">{trailing}</span> : null}
      </div>
      {error ? <p className="text-sm text-pen-danger">{error}</p> : hint ? <p className="text-xs leading-5 text-pen-text-muted">{hint}</p> : null}
    </label>
  );
});
