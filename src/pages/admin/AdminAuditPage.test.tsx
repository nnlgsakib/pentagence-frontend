import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminAuditPage from "@/pages/admin/AdminAuditPage";
import { adminApi } from "@/lib/api";

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    adminApi: {
      ...actual.adminApi,
      audit: vi.fn(),
    },
  };
});

describe("AdminAuditPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders live audit events instead of placeholder content", async () => {
    vi.mocked(adminApi.audit).mockResolvedValue([
      {
        id: 1,
        actor_user_id: null,
        actor_role: null,
        action: "session-finalized",
        target_type: "session",
        target_id: "session-1",
        metadata: { persisted_count: 2 },
        created_at: "2026-03-09T00:10:05Z",
      },
    ]);

    render(<AdminAuditPage />);

    expect(await screen.findByText("session-finalized")).toBeInTheDocument();
    expect(screen.getByText(/session\/session-1/i)).toBeInTheDocument();
  });
});
