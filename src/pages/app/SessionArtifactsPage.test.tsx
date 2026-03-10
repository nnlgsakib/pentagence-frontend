import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SessionArtifactsPage from "@/pages/app/SessionArtifactsPage";
import { sessionApi } from "@/lib/api";

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    sessionApi: {
      get: vi.fn(),
      listArtifacts: vi.fn(),
      downloadArtifact: vi.fn(),
    },
  };
});

describe("SessionArtifactsPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    Object.defineProperty(URL, "createObjectURL", {
      writable: true,
      value: vi.fn(() => "blob:preview"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      writable: true,
      value: vi.fn(),
    });
  });

  const sessionRecord = {
    id: "session-1",
    user_id: "user-1",
    target_url: "https://example.com",
    repo_ref: "repo",
    status: "completed" as const,
    created_at: "2026-03-09T00:00:00Z",
    started_at: "2026-03-09T00:01:00Z",
    ended_at: "2026-03-09T00:10:00Z",
    error_reason: null,
    cleanup_status: "completed",
    cleanup_error: null,
    finalized_at: "2026-03-09T00:10:10Z",
    last_output_sync_at: "2026-03-09T00:10:05Z",
    output_summary: { persisted_count: 1, workflow_log_found: true },
  };

  function renderPage() {
    render(
      <MemoryRouter initialEntries={["/app/sessions/session-1/artifacts"]}>
        <Routes>
          <Route path="/app/sessions/:sessionId/artifacts" element={<SessionArtifactsPage />} />
        </Routes>
      </MemoryRouter>,
    );
  }

  it("renders categorized audit-log outputs", async () => {
    vi.mocked(sessionApi.get).mockResolvedValue(sessionRecord);
    vi.mocked(sessionApi.listArtifacts).mockResolvedValue([
      {
        id: "artifact-1",
        object_key: "session/workflow.log",
        display_name: "workflow.log",
        mime_type: "text/plain",
        size_bytes: 1200,
        category: "workflow-log",
        source_path: "audit-logs/session/workflow.log",
        created_at: "2026-03-09T00:10:05Z",
      },
      {
        id: "artifact-2",
        object_key: "session/agents/recon.log",
        display_name: "recon.log",
        mime_type: "text/plain",
        size_bytes: 400,
        category: "agent-log",
        source_path: "audit-logs/session/agents/recon.log",
        created_at: "2026-03-09T00:10:06Z",
      },
    ]);

    renderPage();

    expect(await screen.findByText("Session Outputs")).toBeInTheDocument();
    expect(screen.getByText("Workflow Log")).toBeInTheDocument();
    expect(screen.getByText("Agent Logs")).toBeInTheDocument();
    expect(screen.getByText("audit-logs/session/workflow.log")).toBeInTheDocument();
  });

  it("loads a text artifact inline through the existing artifact endpoint", async () => {
    vi.mocked(sessionApi.get).mockResolvedValue(sessionRecord);
    vi.mocked(sessionApi.listArtifacts).mockResolvedValue([
      {
        id: "artifact-1",
        object_key: "session/deliverables/report.md",
        display_name: "report.md",
        mime_type: "text/markdown",
        size_bytes: 1024,
        category: "report",
        source_path: "audit-logs/session/deliverables/report.md",
        created_at: "2026-03-09T00:10:05Z",
      },
    ]);
    vi.mocked(sessionApi.downloadArtifact).mockResolvedValue(new Blob(["# Findings\n- item one"], { type: "text/markdown" }));

    renderPage();

    fireEvent.click(await screen.findByRole("button", { name: "report.md" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Inline text")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "report.md" })).toBeInTheDocument();
    expect(screen.queryByText("Preview unavailable")).not.toBeInTheDocument();
    expect(sessionApi.downloadArtifact).toHaveBeenCalledWith("session-1", "artifact-1");
  });

  it("shows html artifacts as source instead of executing them", async () => {
    vi.mocked(sessionApi.get).mockResolvedValue(sessionRecord);
    vi.mocked(sessionApi.listArtifacts).mockResolvedValue([
      {
        id: "artifact-html",
        object_key: "session/deliverables/report.html",
        display_name: "report.html",
        mime_type: "text/html",
        size_bytes: 2048,
        category: "report",
        source_path: "audit-logs/session/deliverables/report.html",
        created_at: "2026-03-09T00:10:05Z",
      },
    ]);
    vi.mocked(sessionApi.downloadArtifact).mockResolvedValue(new Blob(["<h1>Unsafe</h1>"], { type: "text/html" }));

    renderPage();

    fireEvent.click(await screen.findByRole("button", { name: "report.html" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(await screen.findByText("HTML source")).toBeInTheDocument();
    expect(screen.queryByText("Preview unavailable")).not.toBeInTheDocument();
    expect(sessionApi.downloadArtifact).toHaveBeenCalledWith("session-1", "artifact-html");
  });

  it("keeps oversized artifacts download-only", async () => {
    vi.mocked(sessionApi.get).mockResolvedValue(sessionRecord);
    vi.mocked(sessionApi.listArtifacts).mockResolvedValue([
      {
        id: "artifact-big",
        object_key: "session/deliverables/evidence.bin",
        display_name: "evidence.bin",
        mime_type: "application/octet-stream",
        size_bytes: 6 * 1024 * 1024,
        category: "evidence",
        source_path: "audit-logs/session/deliverables/evidence.bin",
        created_at: "2026-03-09T00:10:05Z",
      },
    ]);

    renderPage();

    fireEvent.click(await screen.findByRole("button", { name: "evidence.bin" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(await screen.findByText("Preview unavailable")).toBeInTheDocument();
    expect(screen.getByText(/files larger than 5.0 MB/i)).toBeInTheDocument();
    expect(sessionApi.downloadArtifact).not.toHaveBeenCalled();
  });

  it("renders sanitized artifact source labels without internal object keys", async () => {
    vi.mocked(sessionApi.get).mockResolvedValue(sessionRecord);
    vi.mocked(sessionApi.listArtifacts).mockResolvedValue([
      {
        id: "artifact-safe",
        object_key: "",
        display_name: "workflow.log",
        mime_type: "text/plain",
        size_bytes: 1200,
        category: "workflow-log",
        source_path: "workflow.log",
        created_at: "2026-03-09T00:10:05Z",
      },
    ]);

    renderPage();

    expect(await screen.findByText("Workflow Log")).toBeInTheDocument();
    expect(screen.getAllByText("workflow.log").length).toBeGreaterThan(0);
  });
});
