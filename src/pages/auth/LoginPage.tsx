import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ApiError, authApi } from "@/lib/api";
import { runtimeConfig } from "@/lib/runtime-config";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("admin@pentagence.local");
  const [password, setPassword] = useState("ChangeMe_Admin_123!");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/app");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to sign in");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = authApi.googleLoginUrl("login");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-4 flex justify-center"><AppLogo /></div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Welcome back</h1>
        <p className="mt-2 text-sm text-pen-text-muted">Sign in to access your security workspace, recent runs, and reporting history.</p>
      </div>
      <div className="rounded-2xl border border-pen-border-soft bg-card/90 p-6 shadow-pen-md">
        <div className="mb-5 grid gap-3 rounded-2xl border border-pen-border-soft bg-pen-elevated/30 p-4 text-left sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-pen-text-muted">Run visibility</p>
            <p className="mt-1 text-sm text-foreground">Execution logs, reports, and artifacts remain associated with your account.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-pen-text-muted">Secure access</p>
            <p className="mt-1 text-sm text-foreground">Session handling follows the same short-lived token and refresh protections across sign-in methods.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-pen-text-muted">Operational focus</p>
            <p className="mt-1 text-sm text-foreground">Recent activity and exceptions are available as soon as you enter the dashboard.</p>
          </div>
        </div>

        {runtimeConfig.googleAuthEnabled && (
          <>
            <Button type="button" variant="outline" className="mb-4 w-full justify-center rounded-xl border-pen-border-soft bg-background/70" onClick={handleGoogleLogin}>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-pen-border-soft text-xs font-semibold">G</span>
              Continue with Google
            </Button>
            <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-pen-text-muted">
              <span className="h-px flex-1 bg-pen-border-soft" />
              or sign in with email
              <span className="h-px flex-1 bg-pen-border-soft" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
            <div className="flex items-center rounded-xl border border-pen-border-soft bg-pen-surface2 px-3 focus-within:ring-2 focus-within:ring-pen-brand/40">
              <Mail className="h-4 w-4 text-pen-text-muted" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" className="w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none" />
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-sm font-medium text-foreground">Password</label>
              <Link to="/auth/forgot-password" className="text-sm text-pen-brand hover:text-pen-brand-hover">Forgot password?</Link>
            </div>
            <div className="flex items-center rounded-xl border border-pen-border-soft bg-pen-surface2 px-3 focus-within:ring-2 focus-within:ring-pen-brand/40">
              <LockKeyhole className="h-4 w-4 text-pen-text-muted" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" className="w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none" />
            </div>
          </div>
          {error && <p className="rounded-lg border border-pen-danger/30 bg-pen-danger/5 px-3 py-2 text-sm text-pen-danger">{error}</p>}
          <Button type="submit" className="w-full rounded-xl" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>
          <p className="text-xs text-pen-text-muted">Use your Pentagence credentials or Google SSO when it is enabled for this environment.</p>
        </form>
      </div>
      <p className="text-center text-sm text-pen-text-muted">
        Don't have an account? <Link to="/auth/register" className="text-pen-brand hover:text-pen-brand-hover">Sign up</Link>
      </p>
    </div>
  );
}
