import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldX } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <ShieldX className="h-16 w-16 text-pen-danger mx-auto mb-6" />
        <h1 className="font-heading text-4xl font-bold text-foreground mb-2">403</h1>
        <p className="text-lg text-pen-text-secondary mb-6">You don't have permission to access this resource.</p>
        <div className="flex justify-center gap-3">
          <Button asChild><Link to="/app">Go to Dashboard</Link></Button>
          <Button variant="outline" asChild><Link to="/contact">Contact Support</Link></Button>
        </div>
      </div>
    </div>
  );
}
