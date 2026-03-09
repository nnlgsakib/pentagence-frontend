import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SessionDetailPage from "@/pages/app/SessionDetailPage";
import { sessionApi } from "@/lib/api";

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    sessionApi: {
      get: vi.fn(),
      listArtifacts: vi.fn(),
      cancel: vi.fn(),
    },
  };
});

describe("SessionDetailPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders shannon terminal summary details", async () => {
    vi.mocked(sessionApi.get).mockResolvedValue({
      id: "session-1",
      user_id: "user-1",
      target_url: "https://example.com",
      repo_ref: "repo",
      status: "completed",
      created_at: "2026-03-09T00:00:00Z",
      started_at: "2026-03-09T00:01:00Z",
      ended_at: "2026-03-09T00:10:00Z",
      error_reason: null,
      cleanup_status: "completed",
      cleanup_error: null,
      finalized_at: "2026-03-09T00:10:10Z",
      last_output_sync_at: "2026-03-09T00:10:05Z",
      output_summary: {
        workflow_id: "session-1_shannon-123",
        workspace_name: "session-1",
        terminal_summary: {
          total_cost: "$10.20",
          agents: [
            { agent: "recon", duration: "10m 00s", cost: "$1.20" },
          ],
        },
      },
    });
    vi.mocked(sessionApi.listArtifacts).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/app/sessions/session-1"]}>
        <Routes>
          <Route path="/app/sessions/:sessionId" element={<SessionDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Shannon Run Summary")).toBeInTheDocument();
    expect(screen.getByText("session-1_shannon-123")).toBeInTheDocument();
    expect(screen.getByText("recon")).toBeInTheDocument();
    expect(screen.getByText("$10.20")).toBeInTheDocument();
  });
});
