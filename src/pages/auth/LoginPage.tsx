import { AppLogo } from "@/components/AppLogo";
import { AuthField } from "@/components/auth/AuthField";
import { AuthSurface } from "@/components/auth/AuthSurface";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ApiError, authApi } from "@/lib/api";
import { runtimeConfig } from "@/lib/runtime-config";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    <AuthSurface
      eyebrow="Security Workspace Access"
      title="Welcome back to Pentagence"
      description="Sign in to review active assessments, inspect evidence, and move directly into the security work that needs attention."
      footer={
        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account? <Link to="/auth/register" className="font-semibold text-[#0f6b78] transition-colors hover:text-[#0b5560]">Create one</Link>
        </p>
      }
    >
      <div className="space-y-6 p-1">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pen-text-muted">Sign in</p>
              <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">Access your workspace</h2>
            </div>
            <AppLogo collapsed />
          </div>
          <p className="text-sm leading-6 text-pen-text-secondary">Use your email credentials or continue with Google when single sign-on is available.</p>
        </div>

        {runtimeConfig.googleAuthEnabled && (
          <>
            <Button type="button" variant="outline" className="h-12 w-full rounded-2xl border-pen-border-soft bg-pen-surface2 text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-pen-border-strong hover:bg-pen-elevated" onClick={handleGoogleLogin}>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-pen-border-soft bg-pen-base text-xs font-bold text-foreground">G</span>
              Continue with Google
            </Button>
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-pen-text-muted">
              <span className="h-px flex-1 bg-pen-border-soft" />
              or use email
              <span className="h-px flex-1 bg-pen-border-soft" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthField
            label="Work email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@company.com"
            icon={<Mail className="h-4 w-4" />}
            hint="Use the email associated with your Pentagence workspace."
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-foreground">Password</span>
              <Link to="/auth/forgot-password" className="text-sm font-medium text-pen-brand transition-colors hover:text-pen-brand-hover">Forgot password?</Link>
            </div>
            <AuthField
              label=""
              aria-label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              icon={<LockKeyhole className="h-4 w-4" />}
              trailing={
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                  className="rounded-full p-2 text-pen-text-muted transition-colors hover:bg-pen-elevated hover:text-foreground focus:outline-none focus:ring-2 focus:ring-pen-brand/20"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
          </div>

          {error ? <p className="rounded-2xl border border-pen-danger/30 bg-pen-danger/10 px-4 py-3 text-sm text-pen-danger">{error}</p> : null}

          <Button type="submit" className="h-12 w-full rounded-2xl bg-pen-brand text-primary-foreground shadow-[0_18px_35px_hsl(var(--color-brand-primary)/0.22)] transition-all hover:-translate-y-0.5 hover:bg-pen-brand-hover" disabled={loading}>
            {loading ? "Signing in..." : "Sign in securely"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>

          <p className="text-xs leading-5 text-pen-text-muted">Your session remains protected by short-lived tokens and rotating refresh sessions after sign-in.</p>
        </form>
      </div>
    </AuthSurface>
  );
}
