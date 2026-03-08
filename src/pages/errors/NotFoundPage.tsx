import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <FileQuestion className="h-16 w-16 text-pen-text-muted mx-auto mb-6" />
        <h1 className="font-heading text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-lg text-pen-text-secondary mb-6">The page you're looking for doesn't exist.</p>
        <Button asChild><Link to="/">Go Home</Link></Button>
      </div>
    </div>
  );
}
