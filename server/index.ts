import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Match the Vite development proxy when serving the complete built site
  // locally. Hosted pages continue to call api.memova.ai directly.
  app.use(
    "/__memova_api",
    express.raw({ type: "*/*", limit: "2mb" }),
    async (req, res, next) => {
      if (!["localhost", "127.0.0.1", "::1", "[::1]"].includes(req.hostname)) {
        next();
        return;
      }
      try {
        const requested = new URL(req.originalUrl, "http://localhost");
        const upstreamUrl = new URL(process.env.VITE_API_PROXY_TARGET || "https://api.memova.ai");
        upstreamUrl.pathname = requested.pathname.replace(/^\/__memova_api/, "");
        upstreamUrl.search = requested.search;
        const headers = new Headers();
        for (const name of ["accept", "content-type", "authorization", "x-request-id"]) {
          const value = req.get(name);
          if (value) headers.set(name, value);
        }
        const upstream = await fetch(upstreamUrl, {
          method: req.method,
          headers,
          body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
          signal: AbortSignal.timeout(15_000),
        });
        res.status(upstream.status)
          .set("content-type", upstream.headers.get("content-type") || "application/json")
          .set("cache-control", "no-store")
          .send(Buffer.from(await upstream.arrayBuffer()));
      } catch {
        res.status(502).set("cache-control", "no-store").json({
          error: { code: "api.unavailable", message: "Could not reach the Memova API. Please try again." },
        });
      }
    }
  );
  const waitlistApiUrl = new URL(
    "/api/waitlist",
    process.env.WAITLIST_API_ORIGIN || "https://memova.ai"
  );

  app.post(
    "/api/waitlist",
    express.text({ type: "application/json", limit: "16kb" }),
    async (req, res) => {
      try {
        const upstream = await fetch(waitlistApiUrl, {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "user-agent": req.get("user-agent") || "memova-website",
          },
          body: typeof req.body === "string" ? req.body : "",
          signal: AbortSignal.timeout(10_000),
        });
        const responseBody = await upstream.text();

        res.status(upstream.status);
        res.set(
          "content-type",
          upstream.headers.get("content-type") ||
            "application/json; charset=utf-8"
        );
        res.set("cache-control", "no-store");
        res.send(responseBody);
      } catch {
        res
          .status(502)
          .set("cache-control", "no-store")
          .json({ ok: false, error: "waitlist_unavailable" });
      }
    }
  );

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath, { extensions: ["html"] }));

  // Unknown paths use the real noindex 404 shell instead of flashing the
  // homepage before the client router renders its not-found page.
  app.get("*", (_req, res) => {
    res.status(404).sendFile(path.join(staticPath, "404.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
