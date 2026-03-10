import {
  clearStoredUser,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  setStoredUser,
  setTokens,
  type StoredUser,
} from "@/lib/auth-storage";
import { runtimeConfig } from "@/lib/runtime-config";

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  access_expires_at?: string;
  refresh_expires_at?: string;
}

type ApiUser = {
  id?: string;
  email?: string;
  role?: UserRole;
  ID?: string;
  Email?: string;
  Role?: UserRole;
};

type ApiTokens = {
  access_token?: string;
  refresh_token?: string;
  access_expires_at?: string;
  refresh_expires_at?: string;
  AccessToken?: string;
  RefreshToken?: string;
  AccessExpiresAt?: string;
  RefreshExpiresAt?: string;
};

export interface SessionRecord {
  id: string;
  user_id: string;
  target_url: string;
  repo_ref: string;
  status: "queued" | "provisioning" | "running" | "finalizing" | "completed" | "failed" | "canceled";
  created_at: string;
  started_at: string | null;
  ended_at: string | null;
  error_reason: string | null;
  cleanup_status: string;
  cleanup_error: string | null;
  finalized_at: string | null;
  last_output_sync_at: string | null;
  output_summary: Record<string, unknown>;
}

export interface SessionAISummary {
  headline?: string;
  risk_overview?: string;
  business_impact?: string;
  key_findings?: string[];
  next_steps?: string[];
  generated_at?: string;
  provider?: string;
  model?: string;
  source_artifacts?: string[];
}

export interface SessionArtifact {
  id: string;
  object_key: string;
  display_name: string;
  mime_type: string;
  size_bytes: number;
  category: string;
  source_path: string;
  created_at: string;
}

export interface AdminSessionRecord extends SessionRecord {
  user_id: string;
}

export interface AuditEventRecord {
  id: number;
  actor_user_id: string | null;
  actor_role: string | null;
  action: string;
  target_type: string;
  target_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface WorkerRecord {
  id: string;
  name: string;
  cluster: string;
  status: string;
  heartbeat_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SystemMetrics {
  active_sessions: number;
  queued_jobs: number;
  workers: number;
  cleanup_backlog: number;
  failed_runs_24h: number;
  missing_outputs: number;
}

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  skipRefreshRetry?: boolean;
  expect?: "json" | "blob";
};

let inflightRefresh: Promise<boolean> | null = null;

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (normalized.length % 4)) % 4;
  return atob(`${normalized}${"=".repeat(padLength)}`);
}

function isAccessTokenExpiringSoon(token: string, thresholdSeconds = 30): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(parts[1])) as { exp?: number };
    if (!payload.exp) {
      return false;
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowSeconds + thresholdSeconds;
  } catch {
    return false;
  }
}

function apiUrl(path: string): string {
  return `${runtimeConfig.apiBaseUrl}${path}`;
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function toStoredUser(user: User): StoredUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

function normalizeUser(raw: ApiUser | null | undefined): User | null {
  if (!raw) {
    return null;
  }

  const id = raw.id || raw.ID;
  const email = raw.email || raw.Email;
  const role = raw.role || raw.Role;

  if (!id || !email || !role) {
    return null;
  }

  return {
    id,
    email,
    role,
  };
}

function normalizeTokens(raw: ApiTokens | null | undefined): AuthTokens | null {
  if (!raw) {
    return null;
  }

  const accessToken = raw.access_token || raw.AccessToken;
  const refreshToken = raw.refresh_token || raw.RefreshToken;

  if (!accessToken || !refreshToken) {
    return null;
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    access_expires_at: raw.access_expires_at || raw.AccessExpiresAt,
    refresh_expires_at: raw.refresh_expires_at || raw.RefreshExpiresAt,
  };
}

function isAuthEndpoint(path: string): boolean {
  return path.startsWith("/v1/auth/");
}

async function tryRefreshTokens(): Promise<boolean> {
  if (inflightRefresh) {
    return inflightRefresh;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    clearStoredUser();
    return false;
  }

  inflightRefresh = (async () => {
    const response = await fetch(apiUrl("/v1/auth/refresh"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const payload = (await parseJsonSafe(response)) as
      | { user?: ApiUser; tokens?: ApiTokens; error?: string }
      | null;

    const user = normalizeUser(payload?.user);
    const tokens = normalizeTokens(payload?.tokens);

    if (!response.ok || !tokens || !user) {
      clearTokens();
      clearStoredUser();
      return false;
    }

    setTokens(tokens.access_token, tokens.refresh_token);
    setStoredUser(toStoredUser(user));
    return true;
  })();

  try {
    return await inflightRefresh;
  } finally {
    inflightRefresh = null;
  }
}

export async function ensureAccessToken(): Promise<string | null> {
  const currentToken = getAccessToken();
  if (currentToken && !isAccessTokenExpiringSoon(currentToken)) {
    return currentToken;
  }

  const refreshed = await tryRefreshTokens();
  if (!refreshed) {
    return null;
  }

  return getAccessToken();
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, skipAuth = false, skipRefreshRetry = false, expect = "json" } = options;

  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  if (body && !(body instanceof FormData) && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (!skipAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      requestHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }

  const response = await fetch(apiUrl(path), {
    method,
    headers: requestHeaders,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && !skipAuth && !skipRefreshRetry && !isAuthEndpoint(path)) {
    const refreshed = await tryRefreshTokens();
    if (refreshed) {
      return apiRequest<T>(path, { ...options, skipRefreshRetry: true });
    }
  }

  if (!response.ok) {
    const payload = await parseJsonSafe(response);
    let message = "Request failed";
    if (payload && typeof payload === "object" && "error" in payload) {
      const maybeMessage = (payload as { error?: unknown }).error;
      if (typeof maybeMessage === "string") {
        message = maybeMessage;
      }
    }
    throw new ApiError(message, response.status, payload);
  }

  if (expect === "blob") {
    return (await response.blob()) as T;
  }

  return (await parseJsonSafe(response)) as T;
}

export const authApi = {
  async login(email: string, password: string): Promise<User> {
    const payload = await apiRequest<{ user: ApiUser; tokens: ApiTokens }>("/v1/auth/login", {
      method: "POST",
      body: { email, password },
      skipAuth: true,
    });

    const user = normalizeUser(payload.user);
    const tokens = normalizeTokens(payload.tokens);

    if (!user || !tokens) {
      throw new ApiError("Malformed auth response", 500, payload);
    }

    setTokens(tokens.access_token, tokens.refresh_token);
    setStoredUser(toStoredUser(user));
    return user;
  },

  async register(email: string, password: string): Promise<User> {
    const payload = await apiRequest<{ user: User }>("/v1/auth/register", {
      method: "POST",
      body: { email, password },
      skipAuth: true,
    });
    return payload.user;
  },

  async logout(): Promise<void> {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await apiRequest<{ ok: boolean }>("/v1/auth/logout", {
          method: "POST",
          body: { refresh_token: refreshToken },
          skipAuth: true,
          skipRefreshRetry: true,
        });
      } catch {
        // Ignore network/auth errors during sign-out.
      }
    }
    clearTokens();
    clearStoredUser();
  },

  async logoutAll(): Promise<void> {
    await apiRequest<{ ok: boolean }>("/v1/auth/logout-all", { method: "POST" });
  },

  getStoredUser,
};

export const sessionApi = {
  async list(): Promise<SessionRecord[]> {
    const payload = await apiRequest<{ sessions: SessionRecord[] }>("/v1/sessions/");
    return payload.sessions || [];
  },

  async get(id: string): Promise<SessionRecord> {
    const payload = await apiRequest<{ session: SessionRecord }>(`/v1/sessions/${id}`);
    return payload.session;
  },

  async create(input: { repoRef: string; targetUrl: string; idempotencyKey?: string }): Promise<SessionRecord> {
    const headers: Record<string, string> = {};
    if (input.idempotencyKey) {
      headers["Idempotency-Key"] = input.idempotencyKey;
    }

    const payload = await apiRequest<{ session: SessionRecord }>("/v1/sessions/", {
      method: "POST",
      headers,
      body: {
        repo_ref: input.repoRef,
        target_url: input.targetUrl,
      },
    });
    return payload.session;
  },

  async cancel(id: string): Promise<void> {
    await apiRequest<{ ok: boolean }>(`/v1/sessions/${id}/cancel`, { method: "POST" });
  },

  async retryAISummary(id: string): Promise<{ ok: boolean; retry_count: number }> {
    return apiRequest<{ ok: boolean; retry_count: number }>(`/v1/sessions/${id}/ai-summary/retry`, { method: "POST" });
  },

  async listArtifacts(sessionId: string): Promise<SessionArtifact[]> {
    const payload = await apiRequest<{ artifacts: SessionArtifact[] }>(`/v1/sessions/${sessionId}/artifacts`);
    return payload.artifacts || [];
  },

  async downloadArtifact(sessionId: string, artifactId: string): Promise<Blob> {
    return apiRequest<Blob>(`/v1/sessions/${sessionId}/artifacts/${artifactId}`, { expect: "blob" });
  },
};

export const adminApi = {
  async sessions(): Promise<AdminSessionRecord[]> {
    const payload = await apiRequest<{ sessions: AdminSessionRecord[] }>("/v1/admin/sessions");
    return payload.sessions || [];
  },

  async workers(): Promise<WorkerRecord[]> {
    const payload = await apiRequest<{ workers: WorkerRecord[] }>("/v1/admin/workers");
    return payload.workers || [];
  },

  async queue(): Promise<Record<string, number>> {
    const payload = await apiRequest<{ queue: Record<string, number> }>("/v1/admin/queue");
    return payload.queue || {};
  },

  async system(): Promise<SystemMetrics> {
    return apiRequest<SystemMetrics>("/v1/admin/system");
  },

  async audit(): Promise<AuditEventRecord[]> {
    const payload = await apiRequest<{ events: AuditEventRecord[] }>("/v1/admin/audit");
    return payload.events || [];
  },

  async cancelSession(sessionId: string): Promise<void> {
    await apiRequest<{ ok: boolean }>(`/v1/admin/sessions/${sessionId}/cancel`, { method: "POST" });
  },

  async retryCleanup(sessionId: string): Promise<void> {
    await apiRequest<{ ok: boolean }>(`/v1/admin/sessions/${sessionId}/cleanup`, { method: "POST" });
  },
};
