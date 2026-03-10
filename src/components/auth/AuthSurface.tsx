import { ReactNode } from "react";
import { AppLogo } from "@/components/AppLogo";
import { ShieldCheck, Sparkles, Zap } from "lucide-react";

interface AuthSurfaceProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

const highlights = [
  {
    title: "Operational clarity",
    description: "Review runs, artifacts, and live execution context without leaving your workspace.",
    icon: ShieldCheck,
  },
  {
    title: "Confident access",
    description: "Strong validation, password ergonomics, and consistent sign-in controls reduce friction.",
    icon: Zap,
  },
  {
    title: "Production-ready polish",
    description: "A sharper auth experience builds trust before users launch their first session.",
    icon: Sparkles,
  },
];

export function AuthSurface({ eyebrow, title, description, children, footer }: AuthSurfaceProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
      <section className="relative overflow-hidden rounded-[28px] border border-pen-border-soft bg-[radial-gradient(circle_at_top_left,rgba(0,212,170,0.14),transparent_28%),linear-gradient(145deg,hsl(var(--color-bg-surface-1)),hsl(var(--color-bg-surface-2))_52%,rgba(8,24,35,0.94))] p-6 text-foreground shadow-pen-lg sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.03),transparent_30%,transparent_70%,rgba(255,255,255,0.02))]" />
        <div className="absolute -right-20 top-10 h-52 w-52 rounded-full bg-pen-brand/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-pen-accent/12 blur-3xl" />
        <div className="relative space-y-8">
          <AppLogo />
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pen-text-muted">{eyebrow}</p>
            <div className="space-y-3">
              <h1 className="max-w-xl font-heading text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
              <p className="max-w-lg text-sm leading-6 text-pen-text-secondary sm:text-base">{description}</p>
            </div>
          </div>

          <div className="grid gap-3">
            {highlights.map(({ title: itemTitle, description: itemDescription, icon: Icon }) => (
              <div key={itemTitle} className="flex gap-4 rounded-2xl border border-pen-border-soft bg-pen-elevated/40 px-4 py-4 backdrop-blur-sm">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-pen-border-soft bg-pen-brand/10">
                  <Icon className="h-4 w-4 text-pen-brand" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{itemTitle}</p>
                  <p className="mt-1 text-sm leading-6 text-pen-text-secondary">{itemDescription}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-pen-border-soft bg-card/95 p-5 shadow-pen-lg backdrop-blur xl:p-6">
        {children}
        {footer}
      </section>
    </div>
  );
}
