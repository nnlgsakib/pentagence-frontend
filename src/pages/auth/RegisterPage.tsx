import { AppLogo } from "@/components/AppLogo";
import { AuthField } from "@/components/auth/AuthField";
import { AuthSurface } from "@/components/auth/AuthSurface";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ApiError, authApi } from "@/lib/api";
import { runtimeConfig } from "@/lib/runtime-config";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    <AuthSurface
      eyebrow="Create Your Workspace"
      title="Set up secure access in minutes"
      description="Create your account to launch assessments, review findings, and manage evidence from a single security workspace."
      footer={
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/auth/login" className="font-semibold text-[#0f6b78] transition-colors hover:text-[#0b5560]">Sign in</Link>
        </p>
      }
    >
      <div className="space-y-6 p-1">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pen-text-muted">Account setup</p>
              <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">Create your Pentagence account</h2>
            </div>
            <AppLogo collapsed />
          </div>
          <p className="text-sm leading-6 text-pen-text-secondary">A refined sign-up flow keeps the first step clear: create credentials, protect access, and start working.</p>
        </div>

        {runtimeConfig.googleAuthEnabled && (
          <>
            <Button type="button" variant="outline" className="h-12 w-full rounded-2xl border-pen-border-soft bg-pen-surface2 text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-pen-border-strong hover:bg-pen-elevated" onClick={handleGoogleRegister}>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-pen-border-soft bg-pen-base text-xs font-bold text-foreground">G</span>
              Continue with Google
            </Button>
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-pen-text-muted">
              <span className="h-px flex-1 bg-pen-border-soft" />
              or register with email
              <span className="h-px flex-1 bg-pen-border-soft" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthField
            label="Full name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Jane Doe"
            icon={<UserRound className="h-4 w-4" />}
          />

          <AuthField
            label="Work email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@company.com"
            icon={<Mail className="h-4 w-4" />}
          />

          <AuthField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Create a strong password"
            icon={<LockKeyhole className="h-4 w-4" />}
            hint="Use at least eight characters with uppercase, lowercase, and numeric characters."
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

          <label className="flex items-start gap-3 rounded-2xl border border-pen-border-soft bg-pen-surface2/60 px-4 py-4 text-sm text-pen-text-secondary">
            <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-pen-border-strong bg-pen-base text-pen-brand focus:ring-pen-brand" />
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </label>

          {error ? <p className="rounded-2xl border border-pen-danger/30 bg-pen-danger/10 px-4 py-3 text-sm text-pen-danger">{error}</p> : null}

          <Button type="submit" className="h-12 w-full rounded-2xl bg-pen-brand text-primary-foreground shadow-[0_18px_35px_hsl(var(--color-brand-primary)/0.22)] transition-all hover:-translate-y-0.5 hover:bg-pen-brand-hover" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </AuthSurface>
  );
}
