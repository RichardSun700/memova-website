import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  root,
  plugins: [react()],
  build: {
    outDir: path.resolve(root, "../dist/watch-homepage"),
    emptyOutDir: true,
    rollupOptions: { input: {
      main: path.join(root, "index.html"),
      chimes: path.join(root, "wind-chimes.html"),
      mentor: path.join(root, "mentor-classroom.html"),
    } },
  },
  server: { host: "127.0.0.1", port: 4180 },
});
