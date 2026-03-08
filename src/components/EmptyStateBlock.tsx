import { ReactNode } from "react";

interface EmptyStateBlockProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyStateBlock({ icon, title, description, action }: EmptyStateBlockProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pen-elevated border border-pen-border-soft text-pen-text-muted mb-4">
        {icon}
      </div>
      <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-pen-text-muted max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
