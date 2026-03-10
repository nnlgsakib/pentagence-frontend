import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ApiError, authApi } from "@/lib/api";
import { runtimeConfig } from "@/lib/runtime-config";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(email, password);
      navigate("/app");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to register account");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = authApi.googleLoginUrl("register");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-4 flex justify-center"><AppLogo /></div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Create your account</h1>
        <p className="mt-2 text-sm text-pen-text-muted">Set up your workspace to launch runs, review findings, and manage evidence in one place.</p>
      </div>
      <div className="rounded-2xl border border-pen-border-soft bg-card/90 p-6 shadow-pen-md">
        <div className="mb-5 grid gap-3 rounded-2xl border border-pen-border-soft bg-pen-elevated/30 p-4 text-left sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-pen-text-muted">Centralized workflow</p>
            <p className="mt-1 text-sm text-foreground">Run sessions, review outputs, and track outcomes from a single workspace.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-pen-text-muted">Reliable reporting</p>
            <p className="mt-1 text-sm text-foreground">Dashboard summaries reflect actual session activity rather than placeholder metrics.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-pen-text-muted">Flexible access</p>
            <p className="mt-1 text-sm text-foreground">Use email and password or Google sign-in when it is available in your environment.</p>
          </div>
        </div>

        {runtimeConfig.googleAuthEnabled && (
          <>
            <Button type="button" variant="outline" className="mb-4 w-full justify-center rounded-xl border-pen-border-soft bg-background/70" onClick={handleGoogleRegister}>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-pen-border-soft text-xs font-semibold">G</span>
              Continue with Google
            </Button>
            <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-pen-text-muted">
              <span className="h-px flex-1 bg-pen-border-soft" />
              or create with email
              <span className="h-px flex-1 bg-pen-border-soft" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
            <div className="flex items-center rounded-xl border border-pen-border-soft bg-pen-surface2 px-3 focus-within:ring-2 focus-within:ring-pen-brand/40">
              <UserRound className="h-4 w-4 text-pen-text-muted" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none" placeholder="Jane Doe" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
            <div className="flex items-center rounded-xl border border-pen-border-soft bg-pen-surface2 px-3 focus-within:ring-2 focus-within:ring-pen-brand/40">
              <Mail className="h-4 w-4 text-pen-text-muted" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none" placeholder="you@company.com" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
            <div className="flex items-center rounded-xl border border-pen-border-soft bg-pen-surface2 px-3 focus-within:ring-2 focus-within:ring-pen-brand/40">
              <LockKeyhole className="h-4 w-4 text-pen-text-muted" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none" placeholder="Min. 8 characters" />
            </div>
            <p className="mt-1 text-xs text-pen-text-muted">Choose a strong password with uppercase, lowercase, and numeric characters.</p>
          </div>
          <label className="flex items-start gap-2 rounded-xl border border-pen-border-soft bg-pen-elevated/20 px-3 py-3 text-xs text-pen-text-muted">
            <input type="checkbox" required className="mt-0.5 rounded border-pen-border-soft" />
            I agree to the Terms of Service and Privacy Policy.
          </label>
          {error && <p className="rounded-lg border border-pen-danger/30 bg-pen-danger/5 px-3 py-2 text-sm text-pen-danger">{error}</p>}
          <Button type="submit" className="w-full rounded-xl" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>
      </div>
      <p className="text-center text-sm text-pen-text-muted">
        Already have an account? <Link to="/auth/login" className="text-pen-brand hover:text-pen-brand-hover">Sign in</Link>
      </p>
    </div>
  );
}
