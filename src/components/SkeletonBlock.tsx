export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-pen-elevated ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-pen-border-soft bg-card p-5 space-y-3">
      <SkeletonBlock className="h-4 w-24" />
      <SkeletonBlock className="h-8 w-16" />
      <SkeletonBlock className="h-3 w-32" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="rounded-lg border border-pen-border-soft bg-card p-4 space-y-3">
      <SkeletonBlock className="h-8 w-full" />
      {[...Array(5)].map((_, i) => (
        <SkeletonBlock key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
