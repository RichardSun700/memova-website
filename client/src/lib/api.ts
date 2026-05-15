const PRODUCTION_API_BASE_URL = "https://api.memova.ai";
const LOCAL_API_PROXY_BASE_URL = "/__memova_api";

export const API_BASE_URL = resolveApiBaseUrl().replace(/\/+$/, "");

export type AuthUser = {
  id: string;
  email: string;
  display_name: string | null;
  auth_provider: string | null;
};

export type AuthWorkspace = {
  id: string;
  name: string;
  slug: string;
  type: string;
};

export type EmailLoginStartResponse = {
  challenge_id: string;
  expires_at: string;
  delivery_channel: string;
  dev_code: string | null;
};

export type AuthTokenResponse = {
  access_token: string;
  token_type: "bearer";
  expires_at: string;
  user: AuthUser;
  default_workspace: AuthWorkspace;
};

export type CurrentUserResponse = {
  user: AuthUser;
  default_workspace: AuthWorkspace;
};

export type McpAuthorizationRequest = {
  id: string;
  client_id: string;
  client_name: string | null;
  client_uri: string | null;
  logo_uri: string | null;
  redirect_uri: string;
  resource: string;
  scopes: string[];
  status: string;
  expires_at: string;
  created_at: string | null;
};

export type McpAuthorizationResponse = {
  redirect_uri: string;
  authorization_request: McpAuthorizationRequest;
};

export type McpConnection = {
  connection_id: string;
  client_id: string;
  client_name: string | null;
  client_uri: string | null;
  logo_uri: string | null;
  scopes: string[];
  resource: string;
  connected_at: string;
  last_used_at: string | null;
  access_expires_at: string | null;
  revoked_at: string | null;
  status: "active" | "expired" | "revoked" | string;
};

export type McpConnectionListResponse = {
  connections: McpConnection[];
};

type RequestOptions = {
  method?: "GET" | "POST" | "DELETE";
  token?: string | null;
  body?: unknown;
};

export class ApiError extends Error {
  status: number;
  code: string;
  details: unknown;

  constructor({
    status,
    code,
    message,
    details,
  }: {
    status: number;
    code: string;
    message: string;
    details?: unknown;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function startEmailLogin(
  email: string
): Promise<EmailLoginStartResponse> {
  return apiRequest<EmailLoginStartResponse>("/v1/auth/email/start", {
    method: "POST",
    body: { email },
  });
}

export async function verifyEmailLogin(
  challengeId: string,
  code: string
): Promise<AuthTokenResponse> {
  return apiRequest<AuthTokenResponse>("/v1/auth/email/verify", {
    method: "POST",
    body: { challenge_id: challengeId, code },
  });
}

export async function getCurrentUser(
  token: string
): Promise<CurrentUserResponse> {
  return apiRequest<CurrentUserResponse>("/v1/auth/me", { token });
}

export async function logoutSession(token: string): Promise<void> {
  await apiRequest<void>("/v1/auth/logout", { method: "POST", token });
}

export async function getMcpAuthorizationRequest(
  token: string,
  requestId: string
): Promise<McpAuthorizationRequest> {
  return apiRequest<McpAuthorizationRequest>(
    `/v1/mcp/oauth/authorization-requests/${encodeURIComponent(requestId)}`,
    { token }
  );
}

export async function approveMcpAuthorizationRequest(
  token: string,
  requestId: string
): Promise<McpAuthorizationResponse> {
  return apiRequest<McpAuthorizationResponse>(
    `/v1/mcp/oauth/authorization-requests/${encodeURIComponent(requestId)}/approve`,
    { method: "POST", token }
  );
}

export async function denyMcpAuthorizationRequest(
  token: string,
  requestId: string,
  errorDescription = "The user denied access from the Memova website."
): Promise<McpAuthorizationResponse> {
  return apiRequest<McpAuthorizationResponse>(
    `/v1/mcp/oauth/authorization-requests/${encodeURIComponent(requestId)}/deny`,
    {
      method: "POST",
      token,
      body: {
        error: "access_denied",
        error_description: errorDescription,
      },
    }
  );
}

export async function listMcpConnections(
  token: string
): Promise<McpConnection[]> {
  const response = await apiRequest<McpConnectionListResponse>(
    "/v1/mcp/oauth/connections",
    {
      token,
    }
  );
  return response.connections;
}

export async function revokeMcpConnection(
  token: string,
  connectionId: string
): Promise<McpConnection> {
  return apiRequest<McpConnection>(
    `/v1/mcp/oauth/connections/${encodeURIComponent(connectionId)}/revoke`,
    { method: "POST", token }
  );
}

async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers = new Headers({
    Accept: "application/json",
    "X-Request-ID": makeRequestId(),
  });
  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || "GET",
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch (error) {
    throw new ApiError({
      status: 0,
      code: "network.error",
      message: "Could not reach the Memova API. Please try again.",
      details: error,
    });
  }

  const data = await parseResponseBody(response);
  if (!response.ok) {
    throw toApiError(response.status, data);
  }
  return data as T;
}

function resolveApiBaseUrl(): string {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configuredBaseUrl) return configuredBaseUrl;

  if (
    typeof window !== "undefined" &&
    isLocalHostname(window.location.hostname)
  ) {
    return LOCAL_API_PROXY_BASE_URL;
  }

  return PRODUCTION_API_BASE_URL;
}

function isLocalHostname(hostname: string): boolean {
  return (
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
  );
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function toApiError(status: number, data: unknown): ApiError {
  if (isRecord(data)) {
    const nestedError = data.error;
    if (isRecord(nestedError)) {
      return new ApiError({
        status,
        code: stringValue(nestedError.code) || "api.error",
        message: stringValue(nestedError.message) || "Something went wrong.",
        details: nestedError.details,
      });
    }
    const oauthError = stringValue(data.error);
    if (oauthError) {
      return new ApiError({
        status,
        code: oauthError,
        message: stringValue(data.error_description) || oauthError,
        details: data.details,
      });
    }
  }

  return new ApiError({
    status,
    code: "api.error",
    message: typeof data === "string" ? data : "Something went wrong.",
  });
}

function makeRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `web_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}
