import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ApiError } from "@/lib/api";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4"><AppLogo /></div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Create your account</h1>
        <p className="text-sm text-pen-text-muted mt-1">Start your free trial — no credit card required</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-pen-surface1 border border-pen-border-soft rounded-xl p-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
          <input type="text" required className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50" placeholder="Jane Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50" placeholder="you@company.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 px-3 py-2 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50" placeholder="Min. 8 characters" />
          <p className="text-xs text-pen-text-muted mt-1">Must contain uppercase, lowercase, and a number.</p>
        </div>
        <label className="flex items-start gap-2 text-xs text-pen-text-muted">
          <input type="checkbox" required className="mt-0.5 rounded border-pen-border-soft" />
          I agree to the Terms of Service and Privacy Policy
        </label>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>
        {error && <p className="text-sm text-pen-danger">{error}</p>}
      </form>
      <p className="text-center text-sm text-pen-text-muted">
        Already have an account? <Link to="/auth/login" className="text-pen-brand hover:text-pen-brand-hover">Sign in</Link>
      </p>
    </div>
  );
}
