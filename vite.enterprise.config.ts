import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: path.resolve(import.meta.dirname, "enterprise-site"),
  publicDir: false,
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "client/src") } },
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/enterprise"),
    emptyOutDir: true,
  },
});
