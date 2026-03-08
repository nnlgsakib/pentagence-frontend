import { getAccessToken } from "@/lib/auth-storage";
import { runtimeConfig } from "@/lib/runtime-config";

export interface SessionLogEvent {
  id: string;
  session: string;
  level: string;
  event_type: string;
  message: string;
  ts: string;
}

export type LogsConnectionState = "connecting" | "connected" | "reconnecting" | "closed" | "error";

interface SessionLogsSocketOptions {
  sessionId: string;
  lastId?: string;
  onEvent: (event: SessionLogEvent) => void;
  onState: (state: LogsConnectionState) => void;
  onError: (message: string) => void;
}

function normalizeEvent(raw: { id?: string; session?: string; values?: Record<string, unknown> }): SessionLogEvent | null {
  if (!raw.id || !raw.values) {
    return null;
  }

  const values = raw.values;
  return {
    id: raw.id,
    session: raw.session || String(values.session_id || ""),
    level: String(values.level || "info"),
    event_type: String(values.event_type || "worker-log"),
    message: String(values.message || ""),
    ts: String(values.ts || new Date().toISOString()),
  };
}

export class SessionLogsSocket {
  private readonly options: SessionLogsSocketOptions;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: number | null = null;
  private closedByUser = false;
  private cursor = "0-0";

  constructor(options: SessionLogsSocketOptions) {
    this.options = options;
    this.cursor = options.lastId || "0-0";
  }

  connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      this.options.onError("Authentication token missing");
      this.options.onState("error");
      return;
    }

    const base = runtimeConfig.wsBaseUrl;
    const url = new URL(`${base}/v1/sessions/${this.options.sessionId}/logs/ws`);
    url.searchParams.set("last_id", this.cursor);
    url.searchParams.set("access_token", accessToken);

    this.options.onState(this.reconnectAttempts > 0 ? "reconnecting" : "connecting");
    this.ws = new WebSocket(url.toString());

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.options.onState("connected");
    };

    this.ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data as string) as {
          id?: string;
          session?: string;
          values?: Record<string, unknown>;
        };
        const normalized = normalizeEvent(parsed);
        if (!normalized) {
          return;
        }

        this.cursor = normalized.id;
        this.options.onEvent(normalized);
      } catch {
        this.options.onError("Malformed log event received");
      }
    };

    this.ws.onerror = () => {
      this.options.onState("error");
      this.options.onError("Log stream connection error");
    };

    this.ws.onclose = () => {
      this.ws = null;
      if (this.closedByUser) {
        this.options.onState("closed");
        return;
      }

      this.scheduleReconnect();
    };
  }

  disconnect(): void {
    this.closedByUser = true;
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts += 1;
    const delay = Math.min(30000, 1000 * Math.max(1, this.reconnectAttempts));
    this.options.onState("reconnecting");
    this.reconnectTimer = window.setTimeout(() => this.connect(), delay);
  }
}
