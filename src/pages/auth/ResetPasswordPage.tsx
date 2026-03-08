import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => navigate("/auth/login"), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4"><AppLogo /></div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Set new password</h1>
      </div>
      {success ? (
        <div className="bg-pen-surface1 border border-pen-success/30 rounded-xl p-6 text-center">
          <p className="text-sm text-foreground font-medium">Password updated!</p>
          <p className="text-xs text-pen-text-muted mt-1">Redirecting to sign in...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-pen-surface1 border border-pen-border-soft rounded-xl p-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
            <input type="password" required minLength={8} className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
            <input type="password" required minLength={8} className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50" />
          </div>
          <Button type="submit" className="w-full">Update Password</Button>
        </form>
      )}
    </div>
  );
}
