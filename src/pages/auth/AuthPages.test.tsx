import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
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

    fireEvent.change(screen.getByPlaceholderText("you@company.com"), { target: { value: "admin@pentagence.local" } });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), { target: { value: "ChangeMe_Admin_123!" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in securely/i }));
    expect(await screen.findByRole("button", { name: /signing in/i })).toBeDisabled();
    await act(async () => {
      resolveLogin?.();
    });
  });

  it("toggles password visibility on login", async () => {
    await renderLoginPage(false);

    const passwordField = screen.getByLabelText("Password") as HTMLInputElement;
    expect(passwordField.type).toBe("password");

    fireEvent.click(screen.getByRole("button", { name: /show password/i }));
    expect(passwordField.type).toBe("text");

    fireEvent.click(screen.getByRole("button", { name: /hide password/i }));
    expect(passwordField.type).toBe("password");
  });

  it("toggles password visibility on register", async () => {
    await renderRegisterPage(false);

    const passwordField = screen.getByPlaceholderText("Create a strong password") as HTMLInputElement;
    expect(passwordField.type).toBe("password");

    fireEvent.click(screen.getByRole("button", { name: /show password/i }));
    expect(passwordField.type).toBe("text");
  });
});
