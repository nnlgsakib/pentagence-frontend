import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-pen-base px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,170,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(0,157,255,0.12),transparent_24%)]" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--color-brand-primary) / 0.22) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--color-brand-primary) / 0.22) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-pen-brand/10 blur-[120px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
