// Mock data for Pentagence
export const mockSessions = [
  {
    id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9",
    user_id: "u-001",
    target_url: "https://example.com",
    repo_ref: "sample-target-repo",
    status: "completed",
    created_at: "2026-03-08T04:06:51Z",
    started_at: "2026-03-08T04:07:02Z",
    ended_at: "2026-03-08T04:42:18Z",
    error_reason: null,
  },
  {
    id: "a1b2c3d4-1234-5678-9abc-def012345678",
    user_id: "u-001",
    target_url: "https://staging.acme.io",
    repo_ref: "acme-frontend",
    status: "running",
    created_at: "2026-03-08T09:15:00Z",
    started_at: "2026-03-08T09:15:22Z",
    ended_at: null,
    error_reason: null,
  },
  {
    id: "b2c3d4e5-2345-6789-abcd-ef0123456789",
    user_id: "u-001",
    target_url: "https://api.widgets.dev",
    repo_ref: "widgets-api",
    status: "failed",
    created_at: "2026-03-07T22:30:00Z",
    started_at: "2026-03-07T22:30:15Z",
    ended_at: "2026-03-07T22:45:33Z",
    error_reason: "Worker timeout exceeded",
  },
  {
    id: "c3d4e5f6-3456-7890-bcde-f01234567890",
    user_id: "u-002",
    target_url: "https://shop.example.org",
    repo_ref: "shop-monorepo",
    status: "queued",
    created_at: "2026-03-08T10:00:00Z",
    started_at: null,
    ended_at: null,
    error_reason: null,
  },
  {
    id: "d4e5f6a7-4567-8901-cdef-012345678901",
    user_id: "u-001",
    target_url: "https://dashboard.finco.io",
    repo_ref: "finco-dashboard",
    status: "finalizing",
    created_at: "2026-03-08T08:00:00Z",
    started_at: "2026-03-08T08:00:30Z",
    ended_at: null,
    error_reason: null,
  },
];

export const mockLogEvents = [
  { id: "l-001", session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9", level: "info", event_type: "worker-log", message: "Temporal is ready; execution pipeline initialized", ts: "2026-03-08T04:07:02Z" },
  { id: "l-002", session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9", level: "info", event_type: "worker-log", message: "Cloning target repository: sample-target-repo", ts: "2026-03-08T04:07:05Z" },
  { id: "l-003", session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9", level: "info", event_type: "agent", message: "Shannon agent initialized — starting reconnaissance phase", ts: "2026-03-08T04:07:12Z" },
  { id: "l-004", session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9", level: "warn", event_type: "agent", message: "Detected potential injection point at /api/search?q=", ts: "2026-03-08T04:12:45Z" },
  { id: "l-005", session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9", level: "info", event_type: "agent", message: "Running DAST scan on https://example.com", ts: "2026-03-08T04:15:00Z" },
  { id: "l-006", session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9", level: "error", event_type: "finding", message: "HIGH: Reflected XSS in /search endpoint", ts: "2026-03-08T04:22:30Z" },
  { id: "l-007", session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9", level: "info", event_type: "agent", message: "Enumerating API endpoints from OpenAPI spec", ts: "2026-03-08T04:25:00Z" },
  { id: "l-008", session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9", level: "info", event_type: "worker-log", message: "Finalizing session — generating report artifacts", ts: "2026-03-08T04:40:00Z" },
  { id: "l-009", session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9", level: "info", event_type: "system", message: "Session completed successfully. 4 findings generated.", ts: "2026-03-08T04:42:18Z" },
];

export const mockArtifacts = [
  { id: "a-001", session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9", object_key: "logs/workflow.log", display_name: "workflow.log", mime_type: "text/plain", size_bytes: 1050, created_at: "2026-03-08T04:42:18Z" },
  { id: "a-002", session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9", object_key: "reports/pentest-report.pdf", display_name: "pentest-report.pdf", mime_type: "application/pdf", size_bytes: 245000, created_at: "2026-03-08T04:42:18Z" },
  { id: "a-003", session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9", object_key: "evidence/xss-screenshot.png", display_name: "xss-screenshot.png", mime_type: "image/png", size_bytes: 89400, created_at: "2026-03-08T04:22:35Z" },
];

export const mockFindings = [
  {
    id: "f-001",
    session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9",
    severity: "high" as const,
    category: "XSS",
    title: "Reflected input handling without output encoding",
    summary: "Unsanitized query parameter reflected in HTML response at /search endpoint. Attacker can inject arbitrary JavaScript.",
    evidence: "GET /search?q=<script>alert(1)</script> returns unescaped content in response body.",
    recommendation: "Apply context-aware output encoding. Use Content-Security-Policy headers.",
    cvss: 7.5,
    references: ["https://owasp.org/www-community/attacks/xss/", "CWE-79"],
  },
  {
    id: "f-002",
    session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9",
    severity: "critical" as const,
    category: "SQL Injection",
    title: "SQL injection in user lookup endpoint",
    summary: "The /api/users endpoint accepts unsanitized input in the 'id' parameter, allowing SQL injection.",
    evidence: "GET /api/users?id=1' OR '1'='1 returns all user records.",
    recommendation: "Use parameterized queries. Implement input validation.",
    cvss: 9.8,
    references: ["https://owasp.org/www-community/attacks/SQL_Injection", "CWE-89"],
  },
  {
    id: "f-003",
    session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9",
    severity: "medium" as const,
    category: "Configuration",
    title: "Missing security headers",
    summary: "Several recommended security headers are missing from server responses.",
    evidence: "Missing: X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security",
    recommendation: "Add recommended security headers to all responses.",
    cvss: 5.3,
    references: ["https://owasp.org/www-project-secure-headers/"],
  },
  {
    id: "f-004",
    session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9",
    severity: "low" as const,
    category: "Information Disclosure",
    title: "Server version exposed in headers",
    summary: "The Server header reveals the web server software and version.",
    evidence: "Server: nginx/1.21.6",
    recommendation: "Remove or obfuscate the Server header.",
    cvss: 2.1,
    references: ["CWE-200"],
  },
];

export const mockWorkers = [
  { id: "w-001", name: "worker-us-east-1a", cluster: "us-east-1", status: "healthy", heartbeat_at: "2026-03-08T10:14:55Z", capabilities: ["sast", "dast", "recon"] },
  { id: "w-002", name: "worker-us-east-1b", cluster: "us-east-1", status: "healthy", heartbeat_at: "2026-03-08T10:14:52Z", capabilities: ["sast", "dast"] },
  { id: "w-003", name: "worker-eu-west-1a", cluster: "eu-west-1", status: "degraded", heartbeat_at: "2026-03-08T10:13:00Z", capabilities: ["sast", "dast", "recon", "fuzzing"] },
  { id: "w-004", name: "worker-eu-west-1b", cluster: "eu-west-1", status: "offline", heartbeat_at: "2026-03-08T09:45:00Z", capabilities: ["sast"] },
];

export const mockPlatformMetrics = {
  active_sessions: 3,
  queued_jobs: 7,
  healthy_workers: 2,
  avg_runtime_ms: 2116000,
  failed_runs_24h: 1,
};

export const mockReports = [
  { id: "r-001", session_id: "ff8518a3-65d1-4e94-ad59-75d2adc6fec9", title: "Pentest Report — example.com", generated_at: "2026-03-08T04:42:20Z", status: "ready", summary: "4 findings identified across XSS, SQLi, config, and info disclosure categories.", sections: ["Executive Summary", "Findings", "Remediation", "Appendix"], export_urls: ["/reports/r-001.pdf"] },
];

export const mockAuditEvents = [
  { id: "ae-001", actor_user_id: "u-001", actor_role: "admin", action: "session.create", target_type: "session", target_id: "ff8518a3", metadata: { repo: "sample-target-repo" }, created_at: "2026-03-08T04:06:51Z" },
  { id: "ae-002", actor_user_id: "u-001", actor_role: "admin", action: "session.start", target_type: "session", target_id: "ff8518a3", metadata: {}, created_at: "2026-03-08T04:07:02Z" },
  { id: "ae-003", actor_user_id: "u-002", actor_role: "user", action: "session.create", target_type: "session", target_id: "c3d4e5f6", metadata: { repo: "shop-monorepo" }, created_at: "2026-03-08T10:00:00Z" },
  { id: "ae-004", actor_user_id: "u-001", actor_role: "admin", action: "user.update_role", target_type: "user", target_id: "u-003", metadata: { new_role: "user" }, created_at: "2026-03-07T15:30:00Z" },
];
