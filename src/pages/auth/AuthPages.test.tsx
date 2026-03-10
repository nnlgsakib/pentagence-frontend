import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

async function renderLoginPage(googleAuthEnabled: boolean) {
  vi.resetModules();
  const login = vi.fn(() => Promise.resolve());
  vi.doMock("@/hooks/useAuth", () => ({
    useAuth: () => ({
      login,
      register: vi.fn(),
      logout: vi.fn(),
      logoutAll: vi.fn(),
      user: null,
      role: "guest",
      isAuthenticated: false,
      isReady: true,
    }),
  }));
  vi.doMock("@/lib/runtime-config", () => ({
    runtimeConfig: {
      apiBaseUrl: "http://localhost:8080",
      wsBaseUrl: "ws://localhost:8080",
      runtimeMode: "non-docker",
      useDevProxy: false,
      googleAuthEnabled,
    },
  }));
  const module = await import("@/pages/auth/LoginPage");
  render(
    <MemoryRouter>
      <module.default />
    </MemoryRouter>,
  );
  return { login };
}

async function renderRegisterPage(googleAuthEnabled: boolean) {
  vi.resetModules();
  const register = vi.fn(() => Promise.resolve());
  vi.doMock("@/hooks/useAuth", () => ({
    useAuth: () => ({
      login: vi.fn(),
      register,
      logout: vi.fn(),
      logoutAll: vi.fn(),
      user: null,
      role: "guest",
      isAuthenticated: false,
      isReady: true,
    }),
  }));
  vi.doMock("@/lib/runtime-config", () => ({
    runtimeConfig: {
      apiBaseUrl: "http://localhost:8080",
      wsBaseUrl: "ws://localhost:8080",
      runtimeMode: "non-docker",
      useDevProxy: false,
      googleAuthEnabled,
    },
  }));
  const module = await import("@/pages/auth/RegisterPage");
  render(
    <MemoryRouter>
      <module.default />
    </MemoryRouter>,
  );
  return { register };
}

describe("auth pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows Google sign-in on login when enabled", async () => {
    await renderLoginPage(true);

    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
  });

  it("hides Google sign-in on register when disabled", async () => {
    await renderRegisterPage(false);

    expect(screen.queryByText("Continue with Google")).not.toBeInTheDocument();
  });

  it("shows loading state while login submits", async () => {
    let resolveLogin: (() => void) | undefined;
    vi.resetModules();
    const login = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveLogin = resolve;
        }),
    );
    vi.doMock("@/hooks/useAuth", () => ({
      useAuth: () => ({
        login,
        register: vi.fn(),
        logout: vi.fn(),
        logoutAll: vi.fn(),
        user: null,
        role: "guest",
        isAuthenticated: false,
        isReady: true,
      }),
    }));
    vi.doMock("@/lib/runtime-config", () => ({
      runtimeConfig: {
        apiBaseUrl: "http://localhost:8080",
        wsBaseUrl: "ws://localhost:8080",
        runtimeMode: "non-docker",
        useDevProxy: false,
        googleAuthEnabled: false,
      },
    }));
    const module = await import("@/pages/auth/LoginPage");
    render(
      <MemoryRouter>
        <module.default />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /sign in to your dashboard/i }));
    expect(await screen.findByRole("button", { name: /signing in/i })).toBeDisabled();
    resolveLogin?.();
  });
});
