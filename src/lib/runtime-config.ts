export type RuntimeMode = "non-docker" | "docker-split" | "docker-gateway";

export interface RuntimeConfig {
  apiBaseUrl: string;
  wsBaseUrl: string;
  runtimeMode: RuntimeMode;
  useDevProxy: boolean;
}

function isLocalOrigin(urlValue: string): boolean {
  try {
    const parsed = new URL(urlValue);
    return parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function enforceSecureRemoteEndpoint(apiBaseUrl: string): void {
  if (import.meta.env.DEV || apiBaseUrl === "") {
    return;
  }

  if (apiBaseUrl.startsWith("https://") || isLocalOrigin(apiBaseUrl)) {
    return;
  }

  throw new Error("VITE_API_BASE_URL must use https:// for non-localhost production origins");
}

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

function deriveWebSocketBase(apiBase: string): string {
  if (apiBase === "") {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`;
  }

  if (apiBase.startsWith("https://")) {
    return apiBase.replace("https://", "wss://");
  }

  if (apiBase.startsWith("http://")) {
    return apiBase.replace("http://", "ws://");
  }

  return apiBase;
}

export const runtimeConfig: RuntimeConfig = (() => {
  const useDevProxy = import.meta.env.DEV && import.meta.env.VITE_USE_DEV_PROXY !== "false";

  const apiBaseUrl = useDevProxy
    ? ""
    : normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");

  const wsBaseUrl = normalizeBaseUrl(
    import.meta.env.VITE_WS_BASE_URL || deriveWebSocketBase(apiBaseUrl),
  );

  enforceSecureRemoteEndpoint(apiBaseUrl);

  const runtimeMode =
    (import.meta.env.VITE_RUNTIME_MODE as RuntimeMode | undefined) || "non-docker";

  return {
    apiBaseUrl,
    wsBaseUrl,
    runtimeMode,
    useDevProxy,
  };
})();
