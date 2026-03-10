import { useEffect, useMemo, useState } from "react";
import { clearStoredUser, clearTokens, setStoredUser, setTokens } from "@/lib/auth-storage";

function parseHashParams(hash: string): URLSearchParams {
  const normalized = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(normalized);
}

export default function GoogleAuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => parseHashParams(window.location.hash), []);

  useEffect(() => {
    const callbackError = params.get("error");
    if (callbackError) {
      clearTokens();
      clearStoredUser();
      setError(callbackError);
      return;
    }

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const userId = params.get("user_id");
    const userEmail = params.get("user_email");
    const userRole = params.get("user_role");
    if (!accessToken || !refreshToken || !userId || !userEmail || !userRole) {
      setError("Google sign-in response was incomplete.");
      return;
    }

    setTokens(accessToken, refreshToken);
    setStoredUser({
      id: userId,
      email: userEmail,
      role: userRole === "admin" ? "admin" : "user",
    });
    window.location.replace("/app");
  }, [params]);

  return (
    <div className="space-y-4 rounded-2xl border border-pen-border-soft bg-card/80 p-6 text-center shadow-pen-md">
      <h1 className="font-heading text-2xl font-bold text-foreground">Finishing Google sign-in</h1>
      {error ? (
        <p className="text-sm text-pen-danger">{error}</p>
      ) : (
        <p className="text-sm text-pen-text-muted">We are securely signing you in and redirecting you to your dashboard.</p>
      )}
    </div>
  );
}
