export type McpEnvironment = "production" | "isolated-test" | "unspecified";

export type McpDeployment = {
  environment: McpEnvironment;
  serverUrl: string;
};

// Shared by Vite and the browser so a build cannot advertise a different
// environment or silently derive a legacy endpoint for production.
export function resolveMcpDeployment(
  env: Record<string, string | undefined>
): McpDeployment {
  const environment = env.VITE_MCP_ENVIRONMENT?.trim() || "unspecified";
  if (!["production", "isolated-test", "unspecified"].includes(environment)) {
    throw new Error(
      "VITE_MCP_ENVIRONMENT must be production or isolated-test."
    );
  }
  const base = env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "") || "";
  const explicitServer = env.VITE_MCP_SERVER_URL?.trim() || "";

  if (environment === "production") {
    const api = publicHttpsUrl(base);
    if (!api || new URL(api).pathname !== "/") {
      throw new Error(
        "Production MCP requires an explicit HTTPS VITE_API_BASE_URL origin."
      );
    }
    if (!publicHttpsUrl(explicitServer)) {
      throw new Error(
        "Production MCP requires an explicit HTTPS VITE_MCP_SERVER_URL; no endpoint is inferred."
      );
    }
  }

  return {
    environment: environment as McpEnvironment,
    serverUrl: publicHttpsUrl(
      explicitServer || (base ? `${base}/mcp/next` : "")
    ),
  };
}

function publicHttpsUrl(value: string): string {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash
      ? url.href
      : "";
  } catch {
    return "";
  }
}
