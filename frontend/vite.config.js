import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // If VITE_API_BASE_URL is left empty, /api calls are proxied to the local backend.
    proxy: { "/api": "http://localhost:3000" }
  }
});
