export default function AdminPlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
      <div className="rounded-xl border border-pen-border-soft bg-card p-12 text-center">
        <p className="text-pen-text-muted text-sm">This section is configured and ready for backend integration.</p>
      </div>
    </div>
  );
}
