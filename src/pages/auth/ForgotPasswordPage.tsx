import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4"><AppLogo /></div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Reset your password</h1>
        <p className="text-sm text-pen-text-muted mt-1">We'll send you a link to reset your password</p>
      </div>
      {submitted ? (
        <div className="bg-pen-surface1 border border-pen-success/30 rounded-xl p-6 text-center">
          <p className="text-sm text-foreground font-medium">Check your email</p>
          <p className="text-xs text-pen-text-muted mt-1">We've sent a password reset link to your email.</p>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 bg-pen-surface1 border border-pen-border-soft rounded-xl p-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input type="email" required className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50" />
          </div>
          <Button type="submit" className="w-full">Send Reset Link</Button>
        </form>
      )}
      <p className="text-center text-sm text-pen-text-muted">
        <Link to="/auth/login" className="text-pen-brand hover:text-pen-brand-hover">Back to sign in</Link>
      </p>
    </div>
  );
}
