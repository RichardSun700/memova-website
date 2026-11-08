export type McpEnvironment = "production" | "isolated-test" | "unspecified";

export type McpDeployment = {
  environment: McpEnvironment;
  apiBaseUrl: string;
  oauthApiBaseUrl: string;
  serverUrl: string;
};

const API_ORIGINS = {
  production: "https://api.memova.ai",
  "isolated-test":
    "https://memova-next-mcp-test-api.salmonbeach-7b03b3f7.japaneast.azurecontainerapps.io",
};

export function resolveMcpDeployment(
  env: Record<string, string | undefined>
): McpDeployment {
  const environment = env.VITE_MCP_ENVIRONMENT?.trim();
  const apiBaseUrl = env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "") || "";
  const oauthApiBaseUrl =
    env.VITE_MCP_API_BASE_URL?.trim().replace(/\/+$/, "") || "";
  const serverUrl = env.VITE_MCP_SERVER_URL?.trim() || "";

  if (!environment && !apiBaseUrl && !oauthApiBaseUrl && !serverUrl) {
    return {
      environment: "unspecified",
      apiBaseUrl,
      oauthApiBaseUrl,
      serverUrl,
    };
  }
  if (environment !== "production" && environment !== "isolated-test") {
    throw new Error("Set VITE_MCP_ENVIRONMENT to production or isolated-test.");
  }
  const expectedOrigin = API_ORIGINS[environment];
  if (apiBaseUrl !== expectedOrigin || oauthApiBaseUrl !== expectedOrigin) {
    throw new Error(
      "Set the account and MCP authorization API origins for the selected environment."
    );
  }
  if (serverUrl !== `${expectedOrigin}/v2/mcp`) {
    throw new Error(
      "Set VITE_MCP_SERVER_URL to the selected environment’s /v2/mcp endpoint."
    );
  }
  return { environment, apiBaseUrl, oauthApiBaseUrl, serverUrl };
}
