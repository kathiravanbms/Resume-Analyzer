import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: false,
    proxy: {
      // Dev-only CORS shim. OpenCode Go (opencode.ai) sends no CORS headers,
      // so the browser can't call it directly. Set the OpenCode Go "API base
      // URL" in Settings to /api/opencode and Vite forwards it server-side.
      "/api/opencode": {
        target: "https://opencode.ai",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/opencode/, "/zen/go/v1"),
        // OpenCode Go asks clients to identify with their own user agent.
        headers: { "User-Agent": "ResumeAnalyzer/0.1" },
      },
    },
  },
});
