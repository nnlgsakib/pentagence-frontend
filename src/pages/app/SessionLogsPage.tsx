import { useParams, Link } from "react-router-dom";
import { sessionApi, type SessionRecord } from "@/lib/api";
import { ArrowLeft, Pause, Search, Copy, RadioTower, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { SessionLogsSocket, type LogsConnectionState, type SessionLogEvent } from "@/lib/ws-client";

type DisplayLogEvent = SessionLogEvent & {
  repeatCount: number;
  dedupeSignature: string;
};

function buildSignature(event: SessionLogEvent): string {
  return [event.source, event.level, event.event_type, event.message, event.terminal ? "1" : "0"].join("|");
}

function formatConnectionLabel(state: LogsConnectionState): string {
  switch (state) {
    case "connected":
      return "Streaming";
    case "reconnecting":
      return "Reconnecting";
    case "error":
      return "Degraded";
    case "closed":
      return "Closed";
    default:
      return "Connecting";
  }
}

function isPrimaryWorkflowSource(source: string): boolean {
  return source === "workflow-tail";
}

function formatSourceLabel(source: string): string {
  if (source === "workflow-tail") {
    return "pentest";
  }
  return source;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function formatAttachStateLabel(state: string | null): string {
  switch (state) {
    case "resolving":
      return "Resolving workflow";
    case "waiting_for_file":
      return "Waiting for log file";
    case "attaching":
      return "Attaching stream";
    case "attached":
      return "Stream attached";
    case "attach_failed":
      return "Attach failed";
    default:
      return "Awaiting primary stream";
  }
}

function buildAttachStatusMessage(state: string | null, failure: string | null): string {
  switch (state) {
    case "resolving":
      return "Resolving Shannon workflow ID before the primary pentest stream can attach.";
    case "waiting_for_file":
      return "Workflow resolved. Waiting for Shannon to create the workflow log before attaching the live stream.";
    case "attaching":
      return "Workflow log detected. Pentagence is attaching to the authoritative Shannon live stream now.";
    case "attached":
      return "Primary stream attached. Waiting for the first workflow events to arrive.";
    case "attach_failed":
      return failure
        ? `Pentagence could not attach the Shannon live stream: ${failure}`
        : "Pentagence could not attach the Shannon live stream.";
    default:
      return "Waiting for Shannon workflow log resolution. Startup output is kept as secondary diagnostics until the real pentest stream begins.";
  }
}

export default function SessionLogsPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState<SessionRecord | null>(null);
  const [paused, setPaused] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<DisplayLogEvent[]>([]);
  const [connectionState, setConnectionState] = useState<LogsConnectionState>("connecting");
  const [error, setError] = useState<string | null>(null);
  const [terminalEvent, setTerminalEvent] = useState<SessionLogEvent | null>(null);
  const socketRef = useRef<SessionLogsSocket | null>(null);
  const pausedRef = useRef(paused);
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (!sessionId) {
      setError("Session ID is required");
      return;
    }

    let cancelled = false;
    const loadSession = async () => {
      try {
        const nextSession = await sessionApi.get(sessionId);
        if (!cancelled) {
          setSession(nextSession);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load session metadata");
        }
      }
    };

    void loadSession();
    const interval = window.setInterval(() => {
      void loadSession();
    }, 5000);

    const socket = new SessionLogsSocket({
      sessionId,
      onEvent: (event) => {
        if (event.terminal) {
          setTerminalEvent(event);
        }

        setLogs((previous) => {
          if (pausedRef.current) {
            return previous;
          }

          const dedupeSignature = buildSignature(event);
          const last = previous[previous.length - 1];
          if (last?.dedupeSignature === dedupeSignature) {
            const updatedLast: DisplayLogEvent = {
              ...last,
              id: event.id,
              ts: event.ts,
              repeatCount: last.repeatCount + 1,
            };
            const next = [...previous.slice(0, -1), updatedLast];
            return next.length > 1000 ? next.slice(next.length - 1000) : next;
          }

          const next = [...previous, { ...event, dedupeSignature, repeatCount: 1 }];
          return next.length > 1000 ? next.slice(next.length - 1000) : next;
        });
      },
      onState: (state) => {
        setConnectionState(state);
        if (state === "connected") {
          setError(null);
        }
      },
      onError: setError,
    });

    socketRef.current = socket;
    socket.connect();

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionId]);

  const filteredLogs = useMemo(
    () => logs.filter((log) => !search || log.message.toLowerCase().includes(search.toLowerCase())),
    [logs, search],
  );

  useEffect(() => {
    if (paused || !logContainerRef.current) {
      return;
    }

    logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
  }, [filteredLogs, paused]);

  const connectionLabel = formatConnectionLabel(connectionState);
  const primaryLogs = filteredLogs.filter((log) => isPrimaryWorkflowSource(log.source));
  const secondaryLogs = filteredLogs.filter((log) => !isPrimaryWorkflowSource(log.source));
  const terminalSummary = ((session?.output_summary || {}).terminal_summary as Record<string, unknown> | undefined) || {};
  const latestAttachEvent = [...logs].reverse().find((log) => log.attach_state || log.attach_failure || log.workflow_id);
  const attachState = readString(latestAttachEvent?.attach_state) || readString(session?.output_summary?.log_attach_state);
  const attachFailure = readString(latestAttachEvent?.attach_failure) || readString(session?.output_summary?.log_attach_failure);
  const attachWorkflowId = readString(latestAttachEvent?.workflow_id) || readString(session?.output_summary?.workflow_id);
  const statusClassName =
    connectionState === "connected"
      ? "text-pen-success bg-pen-success/10"
      : connectionState === "error"
        ? "text-pen-danger bg-pen-danger/10"
        : "text-pen-warning bg-pen-warning/10";
  const attachStateClassName =
    attachState === "attach_failed"
      ? "border-pen-danger/40 bg-pen-danger/10 text-pen-danger"
      : "border-pen-brand/30 bg-pen-brand/10 text-pen-brand";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/app/sessions/${sessionId}`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="font-heading text-xl font-bold text-foreground">Session Logs</h1>
          <p className="text-sm text-pen-text-muted">Replay-safe live stream with terminal state and source labels.</p>
        </div>
      </div>

      {terminalEvent && (
        <div className="rounded-xl border border-pen-border-soft bg-card px-4 py-3 text-sm text-foreground">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-4 w-4 text-pen-brand" />
            <div>
              <p className="font-medium">Terminal event received</p>
              <p className="text-pen-text-muted">{terminalEvent.message}</p>
            </div>
          </div>
        </div>
      )}

      {session && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-pen-border-soft bg-card px-4 py-3 text-sm">
            <p className="text-xs text-pen-text-muted">Workflow</p>
            <p className="break-all font-medium text-foreground">{String(session.output_summary.workflow_id || terminalSummary.workflow_id || "Resolving")}</p>
          </div>
          <div className="rounded-xl border border-pen-border-soft bg-card px-4 py-3 text-sm">
            <p className="text-xs text-pen-text-muted">Workspace</p>
            <p className="font-medium text-foreground">{String(session.output_summary.workspace_name || session.id)}</p>
          </div>
          <div className="rounded-xl border border-pen-border-soft bg-card px-4 py-3 text-sm">
            <p className="text-xs text-pen-text-muted">Total Cost</p>
            <p className="font-medium text-foreground">{String(terminalSummary.total_cost || "Pending")}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pen-text-muted" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search logs..."
            className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPaused((value) => !value)}>
            <Pause className="mr-1 h-4 w-4" /> {paused ? "Resume" : "Pause"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowDiagnostics((value) => !value)}>
            {showDiagnostics ? "Hide diagnostics" : `Show diagnostics (${secondaryLogs.length})`}
          </Button>
          <span className={`rounded px-2 py-1 text-xs font-medium ${statusClassName}`}>{connectionLabel}</span>
        </div>
      </div>

      {primaryLogs.length === 0 && (filteredLogs.length > 0 || attachState) && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${attachStateClassName}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium">{formatAttachStateLabel(attachState)}</p>
              <p className="text-current/80">{buildAttachStatusMessage(attachState, attachFailure)}</p>
            </div>
            {attachWorkflowId && <span className="rounded bg-black/5 px-2 py-1 text-xs font-medium text-current/80">{attachWorkflowId}</span>}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-pen-border-soft bg-pen-base overflow-hidden">
        <div ref={logContainerRef} className="max-h-[70vh] space-y-1 overflow-y-auto p-4 font-mono text-xs">
          {primaryLogs.length > 0 && <p className="mb-2 text-[11px] uppercase tracking-wide text-pen-brand">Pentest Stream</p>}
          {primaryLogs.map((log) => (
            <div key={log.id} className="group flex gap-3 rounded px-2 py-1 hover:bg-pen-elevated/20">
              <span className="w-20 shrink-0 text-pen-text-muted">{new Date(log.ts).toLocaleTimeString()}</span>
              <span className="w-20 shrink-0 text-pen-text-muted">{formatSourceLabel(log.source)}</span>
              <span className={`w-16 shrink-0 ${log.level === "error" ? "text-pen-danger" : log.level === "warn" ? "text-pen-warning" : "text-pen-text-muted"}`}>
                {log.level.toUpperCase()}
              </span>
              <span className="flex-1 text-pen-text-secondary">{log.message}</span>
              {log.terminal && <RadioTower className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pen-brand" />}
              {log.repeatCount > 1 && (
                <span className="shrink-0 rounded bg-pen-elevated px-1.5 py-0.5 text-[10px] text-pen-text-muted">x{log.repeatCount}</span>
              )}
              <button onClick={() => navigator.clipboard.writeText(log.message)} className="text-pen-text-muted opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100">
                <Copy className="h-3 w-3" />
              </button>
            </div>
          ))}

          {showDiagnostics && secondaryLogs.length > 0 && (
            <>
              <p className="mb-2 mt-4 text-[11px] uppercase tracking-wide text-pen-text-muted">System Diagnostics</p>
              {secondaryLogs.map((log) => (
                <div key={log.id} className="group flex gap-3 rounded px-2 py-1 opacity-85 hover:bg-pen-elevated/20">
                  <span className="w-20 shrink-0 text-pen-text-muted">{new Date(log.ts).toLocaleTimeString()}</span>
                  <span className="w-20 shrink-0 text-pen-text-muted">{formatSourceLabel(log.source)}</span>
                  <span className={`w-16 shrink-0 ${log.level === "error" ? "text-pen-danger" : log.level === "warn" ? "text-pen-warning" : "text-pen-text-muted"}`}>
                    {log.level.toUpperCase()}
                  </span>
                  <span className="flex-1 text-pen-text-secondary">{log.message}</span>
                  {log.repeatCount > 1 && <span className="shrink-0 rounded bg-pen-elevated px-1.5 py-0.5 text-[10px] text-pen-text-muted">x{log.repeatCount}</span>}
                </div>
              ))}
            </>
          )}

          {!paused && connectionState === "connected" && !terminalEvent && (
            <div className="mt-2 flex items-center gap-2 text-pen-brand">
              <span className="h-2 w-2 animate-pulse rounded-full bg-pen-brand" />
              <span>Streaming live events...</span>
            </div>
          )}

          {filteredLogs.length === 0 && <p className="text-pen-text-muted">No logs yet. Reconnect replay will appear here as events arrive.</p>}
          {filteredLogs.length > 0 && primaryLogs.length === 0 && <p className="mt-3 text-pen-text-muted">System diagnostics remain available below until the primary Shannon stream starts.</p>}
        </div>
      </div>

      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
