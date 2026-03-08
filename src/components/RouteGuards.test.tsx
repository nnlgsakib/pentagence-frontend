import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { RequireAuth, RequireGuest } from "@/components/RouteGuards";
import { AuthProvider } from "@/hooks/useAuth";
import { clearStoredUser, clearTokens } from "@/lib/auth-storage";

describe("Route guards", () => {
  it("redirects unauthenticated user from protected route", () => {
    clearTokens();
    clearStoredUser();

    render(
      <MemoryRouter initialEntries={["/app"]}>
        <AuthProvider>
          <Routes>
            <Route
              path="/app"
              element={
                <RequireAuth>
                  <div>Protected app</div>
                </RequireAuth>
              }
            />
            <Route path="/auth/login" element={<div>Login page</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("shows guest route content for unauthenticated user", () => {
    clearTokens();
    clearStoredUser();

    render(
      <MemoryRouter initialEntries={["/auth/login"]}>
        <AuthProvider>
          <Routes>
            <Route
              path="/auth/login"
              element={
                <RequireGuest>
                  <div>Guest login view</div>
                </RequireGuest>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Guest login view")).toBeInTheDocument();
  });
});
