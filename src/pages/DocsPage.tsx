import { Link } from "react-router-dom";
import { Book, Code, HelpCircle, Zap } from "lucide-react";

const sections = [
  { icon: Zap, title: "Getting Started", desc: "Set up your first pentest session in under 5 minutes.", href: "#" },
  { icon: Code, title: "API Reference", desc: "Integrate Pentagence into your CI/CD pipeline.", href: "#" },
  { icon: Book, title: "Guides", desc: "In-depth guides for advanced configuration and agent tuning.", href: "#" },
  { icon: HelpCircle, title: "Troubleshooting", desc: "Common issues and how to resolve them.", href: "#" },
];

export default function DocsPage() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">Documentation</h1>
          <p className="text-pen-text-secondary max-w-lg mx-auto">Everything you need to get the most out of Pentagence.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {sections.map((s) => (
            <Link key={s.title} to={s.href} className="p-6 rounded-xl border border-pen-border-soft bg-card hover:border-pen-brand/30 transition-colors group">
              <s.icon className="h-6 w-6 text-pen-brand mb-3" />
              <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-pen-brand transition-colors">{s.title}</h3>
              <p className="text-sm text-pen-text-muted mt-1">{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
