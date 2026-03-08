import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

function WaitingGate() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-sm text-pen-text-muted">
      Loading session...
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isReady } = useAuth();
  const location = useLocation();
  if (!isReady) return <WaitingGate />;
  if (!isAuthenticated) return <Navigate to="/auth/login" state={{ from: location }} replace />;
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { role, isAuthenticated, isReady } = useAuth();
  const location = useLocation();
  if (!isReady) return <WaitingGate />;
  if (!isAuthenticated) return <Navigate to="/auth/login" state={{ from: location }} replace />;
  if (role !== "admin") return <Navigate to="/403" replace />;
  return <>{children}</>;
}

export function RequireGuest({ children }: { children: ReactNode }) {
  const { isAuthenticated, isReady } = useAuth();
  if (!isReady) return <WaitingGate />;
  if (isAuthenticated) return <Navigate to="/app" replace />;
  return <>{children}</>;
}
