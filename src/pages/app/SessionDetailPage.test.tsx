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

  function renderPage() {
    render(
      <MemoryRouter initialEntries={["/app/sessions/session-1"]}>
        <Routes>
          <Route path="/app/sessions/:sessionId" element={<SessionDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
  }

  it("renders the AI session summary before technical details", async () => {
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
        ai_summary_status: "ready",
        ai_summary_source_artifacts: [
          "audit-logs/session-1/deliverables/report.md",
        ],
        ai_summary: {
          headline: "High-risk auth and XSS issues were confirmed",
          risk_overview: "The target exposes exploitable weaknesses that could allow unauthorized access and client-side compromise.",
          business_impact: "Attackers could access protected functions and pivot into user-impacting actions.",
          key_findings: [
            "Authentication enforcement was bypassable in multiple paths.",
            "Stored or reflected XSS behavior was observed.",
          ],
          next_steps: [
            "Patch the auth checks and retest privileged flows.",
            "Sanitize untrusted input before rendering it in the browser.",
          ],
          generated_at: "2026-03-09T00:10:20Z",
          provider: "groq",
          model: "openai/gpt-oss-20b",
        },
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

    renderPage();

    expect(await screen.findByText("AI Security Summary")).toBeInTheDocument();
    expect(screen.getByText("High-risk auth and XSS issues were confirmed")).toBeInTheDocument();
    expect(screen.getByText(/Authentication enforcement was bypassable/i)).toBeInTheDocument();
    expect(screen.getByText(/Patch the auth checks/i)).toBeInTheDocument();
    expect(screen.getByText("ready")).toBeInTheDocument();
    expect(screen.getByText("Built from persisted evidence")).toBeInTheDocument();
    expect(screen.getByText("Shannon Run Summary")).toBeInTheDocument();
    expect(screen.getByText("session-1_shannon-123")).toBeInTheDocument();
    expect(screen.getByText("recon")).toBeInTheDocument();
    expect(screen.getByText("$10.20")).toBeInTheDocument();
  });

  it("shows a pending AI summary state for completed sessions", async () => {
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
        ai_summary_status: "pending",
      },
    });
    vi.mocked(sessionApi.listArtifacts).mockResolvedValue([]);

    renderPage();

    expect(await screen.findByText("Preparing your readable pentest summary")).toBeInTheDocument();
    expect(screen.getByText(/backend is still generating the narrative summary/i)).toBeInTheDocument();
  });

  it("shows a failed AI summary fallback state", async () => {
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
        ai_summary_status: "failed",
        ai_summary_error: "provider timeout",
      },
    });
    vi.mocked(sessionApi.listArtifacts).mockResolvedValue([]);

    renderPage();

    expect(await screen.findByText("AI summary unavailable for this run")).toBeInTheDocument();
    expect(screen.getByText(/manual retries used/i)).toBeInTheDocument();
  });
});
