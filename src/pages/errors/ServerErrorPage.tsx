import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <AlertTriangle className="h-16 w-16 text-pen-danger mx-auto mb-6" />
        <h1 className="font-heading text-4xl font-bold text-foreground mb-2">500</h1>
        <p className="text-lg text-pen-text-secondary mb-6">Something went wrong on our end. We're working on it.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    </div>
  );
}
