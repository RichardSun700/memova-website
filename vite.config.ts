import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, loadEnv, type ProxyOptions } from "vite";
import { resolveMcpDeployment } from "./shared/mcpDeployment";

const memovaApiProxy: ProxyOptions = {
  target: process.env.VITE_API_PROXY_TARGET || "https://api.memova.ai",
  changeOrigin: true,
  secure: true,
  rewrite: proxyPath => proxyPath.replace(/^\/__memova_api/, ""),
};
const waitlistApiProxy: ProxyOptions = {
  target: process.env.WAITLIST_API_ORIGIN || "https://memova.ai",
  changeOrigin: true,
  secure: true,
};

export default defineConfig(({ command, mode }) => {
  const env = {
    ...loadEnv(mode, import.meta.dirname, "VITE_"),
    ...process.env,
  };
  const deployment = resolveMcpDeployment(env);
  if (
    command === "build" &&
    mode !== "test" &&
    deployment.environment === "unspecified"
  ) {
    throw new Error(
      "Configure the MCP environment and public endpoints before building."
    );
  }
  memovaApiProxy.target = deployment.apiBaseUrl || "https://api.memova.ai";
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    envDir: path.resolve(import.meta.dirname),
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(import.meta.dirname, "client/index.html"),
          pricing: path.resolve(
            import.meta.dirname,
            "client/pricing/index.html"
          ),
        },
      },
    },
    server: {
      port: 3000,
      strictPort: false, // Will find next available port if 3000 is busy
      host: true,
      allowedHosts: [
        ".manuspre.computer",
        ".manus.computer",
        ".manus-asia.computer",
        ".manuscomputer.ai",
        ".manusvm.computer",
        "localhost",
        "127.0.0.1",
      ],
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
      proxy: {
        "/api/waitlist": waitlistApiProxy,
        "/__memova_api": memovaApiProxy,
      },
    },
    preview: {
      proxy: {
        "/api/waitlist": waitlistApiProxy,
        "/__memova_api": memovaApiProxy,
      },
    },
  };
});
