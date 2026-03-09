import type { SessionArtifact } from "@/lib/api";

export const MAX_ARTIFACT_PREVIEW_BYTES = 5 * 1024 * 1024;

export type ArtifactPreviewKind = "text" | "image" | "pdf";

export type ArtifactPreviewSupport = {
  kind: ArtifactPreviewKind;
  sourceLabel: string;
} | {
  kind: "unsupported";
  sourceLabel: string;
  reason: string;
};

const TEXT_EXTENSIONS = new Set([
  ".txt",
  ".log",
  ".json",
  ".md",
  ".markdown",
  ".csv",
  ".yaml",
  ".yml",
  ".xml",
  ".html",
  ".htm",
  ".js",
  ".ts",
  ".tsx",
  ".jsx",
  ".css",
  ".sh",
  ".py",
  ".go",
]);

function getArtifactPath(artifact: SessionArtifact): string {
  return (artifact.source_path || artifact.display_name || artifact.object_key).toLowerCase();
}

function getExtension(path: string): string {
  const lastDot = path.lastIndexOf(".");
  return lastDot >= 0 ? path.slice(lastDot) : "";
}

export function getArtifactPreviewSupport(artifact: SessionArtifact): ArtifactPreviewSupport {
  const mimeType = (artifact.mime_type || "").toLowerCase();
  const extension = getExtension(getArtifactPath(artifact));

  if (artifact.size_bytes > MAX_ARTIFACT_PREVIEW_BYTES) {
    return {
      kind: "unsupported",
      sourceLabel: "Download only",
      reason: `Preview unavailable for files larger than ${formatBytes(MAX_ARTIFACT_PREVIEW_BYTES)}.`,
    };
  }

  if (mimeType === "application/pdf" || extension === ".pdf") {
    return { kind: "pdf", sourceLabel: "Inline PDF" };
  }

  if (mimeType.startsWith("image/")) {
    return { kind: "image", sourceLabel: "Inline image" };
  }

  if (mimeType === "text/html" || mimeType === "application/xhtml+xml" || extension === ".html" || extension === ".htm") {
    return { kind: "text", sourceLabel: "HTML source" };
  }

  if (
    mimeType.startsWith("text/") ||
    mimeType === "application/json" ||
    mimeType === "application/ld+json" ||
    mimeType === "application/xml" ||
    mimeType === "text/markdown" ||
    mimeType.endsWith("+json") ||
    TEXT_EXTENSIONS.has(extension)
  ) {
    return { kind: "text", sourceLabel: "Inline text" };
  }

  return {
    kind: "unsupported",
    sourceLabel: "Download only",
    reason: "Preview is available only for text, markdown, JSON, image, and PDF artifacts.",
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`;
}
