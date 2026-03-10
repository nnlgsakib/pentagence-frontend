import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import { adminApi } from "@/lib/api";

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    adminApi: {
      ...actual.adminApi,
      users: vi.fn(),
    },
  };
});

describe("AdminUsersPage", () => {
  it("renders real backend-backed users", async () => {
    vi.mocked(adminApi.users).mockResolvedValue([
      {
        id: "u-1",
        email: "admin@pentagence.local",
        role: "admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
        must_rotate_password: false,
        session_count: 4,
        last_session_at: new Date().toISOString(),
        active_session_count: 1,
        status: "active",
      },
    ]);

    render(<AdminUsersPage />);

    expect(await screen.findByText("admin@pentagence.local")).toBeInTheDocument();
    expect(screen.getByText(/4 total/i)).toBeInTheDocument();
    expect(screen.getByText(/1 active/i)).toBeInTheDocument();
  });
});
