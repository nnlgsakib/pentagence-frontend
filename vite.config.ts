import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: Number(process.env.VITE_DEV_PORT || 5173),
    proxy:
      process.env.VITE_USE_DEV_PROXY === "false"
        ? undefined
        : {
            "/v1": {
              target: process.env.VITE_DEV_PROXY_TARGET || "http://localhost:8080",
              changeOrigin: true,
              ws: true,
            },
            "/metrics": {
              target: process.env.VITE_DEV_PROXY_TARGET || "http://localhost:8080",
              changeOrigin: true,
            },
          },
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
