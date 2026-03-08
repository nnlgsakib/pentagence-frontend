import { afterEach, describe, expect, it, vi } from "vitest";
import { setTokens, clearTokens } from "@/lib/auth-storage";
import { SessionLogsSocket } from "@/lib/ws-client";

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  url: string;
  onopen: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;
  readyState = 1;

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  close() {
    this.readyState = 3;
    if (this.onclose) {
      this.onclose();
    }
  }
}

describe("SessionLogsSocket", () => {
  afterEach(() => {
    clearTokens();
    vi.restoreAllMocks();
    MockWebSocket.instances = [];
  });

  it("builds websocket url with cursor and token and emits normalized events", () => {
    vi.stubGlobal("WebSocket", MockWebSocket as unknown as typeof WebSocket);
    setTokens("access-token", "refresh-token");

    const onEvent = vi.fn();
    const onState = vi.fn();
    const onError = vi.fn();

    const socket = new SessionLogsSocket({
      sessionId: "session-1",
      lastId: "12-0",
      onEvent,
      onState,
      onError,
    });

    socket.connect();

    const ws = MockWebSocket.instances[0];
    expect(ws.url).toContain("/v1/sessions/session-1/logs/ws");
    expect(ws.url).toContain("last_id=12-0");
    expect(ws.url).toContain("access_token=access-token");

    ws.onopen?.();
    ws.onmessage?.({
      data: JSON.stringify({
        id: "13-0",
        session: "session-1",
        values: { level: "info", event_type: "worker-log", message: "hello", ts: "2026-01-01T00:00:00Z" },
      }),
    } as MessageEvent);

    expect(onState).toHaveBeenCalledWith("connected");
    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "13-0",
        message: "hello",
      }),
    );
    expect(onError).not.toHaveBeenCalled();
  });
});
