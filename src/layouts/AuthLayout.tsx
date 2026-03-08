import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pen-base relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--color-brand-primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--color-brand-primary) / 0.3) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-pen-brand/5 blur-[120px]" />
      
      <div className="relative w-full max-w-md mx-4">
        <Outlet />
      </div>
    </div>
  );
}
