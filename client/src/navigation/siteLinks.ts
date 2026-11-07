import { resolveMcpDeployment } from "@shared/mcpDeployment";

const PUBLIC_SITE_ORIGIN = "https://memova.ai";
const CONSENT_SITE_ROUTES = new Set([
  "/login",
  "/mcp/oauth/consent",
  "/mcp/setup",
  "/profile",
  "/connected-clients",
]);

// Dedicated consent hosts publish account routes only. Their public navigation
// belongs to the main website; general website builds keep the existing origin.
export function resolveSiteUrl(path: string): string {
  if (
    resolveMcpDeployment(import.meta.env).environment === "unspecified" ||
    !path.startsWith("/") ||
    path.startsWith("//")
  ) {
    return path;
  }
  const url = new URL(path, PUBLIC_SITE_ORIGIN);
  const pathname = url.pathname.replace(/\/$/, "");
  return CONSENT_SITE_ROUTES.has(pathname)
    ? `${pathname}${url.search}${url.hash}`
    : url.href;
}
