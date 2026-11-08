import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = path.dirname(fileURLToPath(import.meta.url));
const memovaApiProxy = {
  target: process.env.VITE_API_PROXY_TARGET || "https://api.memova.ai",
  changeOrigin: true,
  secure: true,
  rewrite: proxyPath => proxyPath.replace(/^\/__memova_api/, ""),
};
export default defineConfig({
  root,
  envDir: path.resolve(root, ".."),
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(root, "../client/src") } },
  build: {
    outDir: path.resolve(root, "../dist/watch-homepage"),
    emptyOutDir: true,
    rollupOptions: { input: {
      main: path.join(root, "index.html"),
      chimes: path.join(root, "wind-chimes.html"),
      mentor: path.join(root, "mentor-classroom.html"),
    } },
  },
  server: {
    host: "127.0.0.1",
    port: 4180,
    proxy: { "/__memova_api": memovaApiProxy },
  },
  preview: {
    proxy: { "/__memova_api": memovaApiProxy },
  },
});
