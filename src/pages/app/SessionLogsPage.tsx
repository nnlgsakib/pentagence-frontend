import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Pause, Search, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { SessionLogsSocket, type LogsConnectionState, type SessionLogEvent } from "@/lib/ws-client";

export default function SessionLogsPage() {
  const { sessionId } = useParams();
  const [paused, setPaused] = useState(false);
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<SessionLogEvent[]>([]);
  const [connectionState, setConnectionState] = useState<LogsConnectionState>("connecting");
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<SessionLogsSocket | null>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (!sessionId) {
      setError("Session ID is required");
      return;
    }

    const socket = new SessionLogsSocket({
      sessionId,
      onEvent: (event) => {
        setLogs((previous) => {
          if (pausedRef.current) {
            return previous;
          }

          const next = [...previous, event];
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
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionId]);

  const filteredLogs = useMemo(
    () => logs.filter((log) => !search || log.message.toLowerCase().includes(search.toLowerCase())),
    [logs, search],
  );

  const connectionLabel =
    connectionState === "connected"
      ? "Streaming"
      : connectionState === "reconnecting"
        ? "Reconnecting"
        : connectionState;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/app/sessions/${sessionId}`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="font-heading text-xl font-bold text-foreground">Session Logs</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pen-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="w-full rounded-lg border border-pen-border-soft bg-pen-surface2 pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-pen-text-muted focus:outline-none focus:ring-2 focus:ring-pen-brand/50"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => setPaused(!paused)}>
          <Pause className="h-4 w-4 mr-1" /> {paused ? "Resume" : "Pause"}
        </Button>
        <span className={`text-xs font-medium px-2 py-1 rounded ${connectionState === "connected" ? "text-pen-success bg-pen-success/10" : "text-pen-warning bg-pen-warning/10"}`}>
          {connectionLabel}
        </span>
      </div>

      <div className="rounded-xl border border-pen-border-soft bg-pen-base overflow-hidden">
        <div className="p-4 font-mono text-xs space-y-1 max-h-[70vh] overflow-y-auto">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex gap-3 group hover:bg-pen-elevated/20 px-2 py-0.5 rounded">
              <span className="text-pen-text-muted shrink-0 w-20">{new Date(log.ts).toLocaleTimeString()}</span>
              <span className={`shrink-0 w-12 ${
                log.level === "error" ? "text-pen-danger" :
                log.level === "warn" ? "text-pen-warning" :
                "text-pen-text-muted"
              }`}>
                {log.level.toUpperCase()}
              </span>
              <span className="text-pen-text-secondary flex-1">{log.message}</span>
              <button onClick={() => navigator.clipboard.writeText(log.message)} className="opacity-0 group-hover:opacity-100 text-pen-text-muted hover:text-foreground transition-opacity">
                <Copy className="h-3 w-3" />
              </button>
            </div>
          ))}
          {!paused && connectionState === "connected" && (
            <div className="flex items-center gap-2 text-pen-brand mt-2">
              <span className="h-2 w-2 rounded-full bg-pen-brand animate-pulse" />
              <span>Streaming...</span>
            </div>
          )}
          {filteredLogs.length === 0 && <p className="text-pen-text-muted">No logs yet.</p>}
        </div>
      </div>
      {error && <p className="text-sm text-pen-danger">{error}</p>}
    </div>
  );
}
