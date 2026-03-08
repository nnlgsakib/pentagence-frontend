import { AppLogo } from "@/components/AppLogo";
import { Clock } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="flex justify-center mb-6"><AppLogo /></div>
        <Clock className="h-12 w-12 text-pen-warning mx-auto mb-4" />
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Scheduled Maintenance</h1>
        <p className="text-pen-text-secondary max-w-md mx-auto">We're performing scheduled maintenance. We'll be back shortly. Thank you for your patience.</p>
      </div>
    </div>
  );
}
