import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SessionLogsPage from "@/pages/app/SessionLogsPage";
import { sessionApi } from "@/lib/api";

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    sessionApi: {
      get: vi.fn(),
      list: vi.fn(),
      create: vi.fn(),
      cancel: vi.fn(),
      listArtifacts: vi.fn(),
    },
    ensureAccessToken: vi.fn().mockResolvedValue("access-token"),
  };
});

vi.mock("@/lib/ws-client", () => ({
  SessionLogsSocket: class {
    connect() {}
    disconnect() {}
  },
}));

describe("SessionLogsPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders attach failure guidance when the primary stream is unavailable", async () => {
    vi.mocked(sessionApi.get).mockResolvedValue({
      id: "session-1",
      user_id: "user-1",
      target_url: "https://example.com",
      repo_ref: "repo",
      status: "running",
      created_at: "2026-03-09T00:00:00Z",
      started_at: "2026-03-09T00:01:00Z",
      ended_at: null,
      error_reason: null,
      cleanup_status: "pending",
      cleanup_error: null,
      finalized_at: null,
      last_output_sync_at: null,
      output_summary: {
        workflow_id: "session-1_shannon-123",
        workspace_name: "session-1",
        log_attach_state: "attach_failed",
        log_attach_failure: "workflow log was not created in time",
      },
    });

    render(
      <MemoryRouter initialEntries={["/app/sessions/session-1/logs"]}>
        <Routes>
          <Route path="/app/sessions/:sessionId/logs" element={<SessionLogsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Attach failed")).toBeInTheDocument();
    expect(screen.getByText(/could not attach the Shannon live stream/i)).toBeInTheDocument();
    expect(screen.getAllByText("session-1_shannon-123")).toHaveLength(2);
  });
});
