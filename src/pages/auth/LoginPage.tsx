import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ApiError } from "@/lib/api";

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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4"><AppLogo /></div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="text-sm text-pen-text-muted mt-1">Sign in to your Pentagence account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-pen-surface1 border border-pen-border-soft rounded-xl p-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50" />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-pen-text-muted">
            <input type="checkbox" className="rounded border-pen-border-soft" /> Remember me
          </label>
          <Link to="/auth/forgot-password" className="text-sm text-pen-brand hover:text-pen-brand-hover">Forgot password?</Link>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        {error && <p className="text-sm text-pen-danger">{error}</p>}
      </form>
      <p className="text-center text-sm text-pen-text-muted">
        Don't have an account? <Link to="/auth/register" className="text-pen-brand hover:text-pen-brand-hover">Sign up</Link>
      </p>
    </div>
  );
}
