import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest, authApi } from "@/lib/api";
import { clearStoredUser, clearTokens, setTokens } from "@/lib/auth-storage";

describe("apiRequest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    clearTokens();
    clearStoredUser();
  });

  it("retries once after refresh when request is unauthorized", async () => {
    setTokens("old-access", "refresh-token");

    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "invalid token" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            user: { id: "u-1", email: "user@example.com", role: "user" },
            tokens: { access_token: "next-access", refresh_token: "next-refresh" },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ sessions: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

    const payload = await apiRequest<{ sessions: unknown[] }>("/v1/sessions/");

    expect(payload.sessions).toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[1][0]).toMatch(/\/v1\/auth\/refresh$/);
  });

  it("accepts backend auth response with PascalCase token fields", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          user: { ID: "u-2", Email: "case@example.com", Role: "user" },
          tokens: {
            AccessToken: "access-pascal",
            RefreshToken: "refresh-pascal",
            AccessExpiresAt: "2026-03-08T06:15:30Z",
            RefreshExpiresAt: "2026-03-15T06:00:30Z",
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    const user = await authApi.login("case@example.com", "StrongPass123#");

    expect(user).toEqual({ id: "u-2", email: "case@example.com", role: "user" });
  });
});
