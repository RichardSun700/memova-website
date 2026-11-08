import type { EmailLoginStartResponse } from "./api";

const RETURN_PATHS = new Set([
  "/profile",
  "/connected-clients",
  "/settings/connected-clients",
  "/mcp/setup",
  "/mcp/oauth/consent",
]);

export function normalizeLoginReturnPath(
  value: string | null,
  fallback = "/profile"
): string {
  if (!value || !value.startsWith("/") || value.startsWith("//"))
    return fallback;
  let decoded = value;
  try {
    for (let count = 0; count < 3; count += 1) {
      if (/[\\\u0000-\u0020\u007f]/.test(decoded) || decoded.startsWith("//"))
        return fallback;
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
    const url = new URL(value, "https://memova.ai");
    const rawPath = value.split(/[?#]/, 1)[0];
    if (
      url.origin !== "https://memova.ai" ||
      rawPath !== url.pathname ||
      !RETURN_PATHS.has(url.pathname)
    )
      return fallback;
    return value;
  } catch {
    return fallback;
  }
}

export type EmailLoginFlow = {
  email: string;
  challenge: EmailLoginStartResponse;
  resendAt: number;
};

export function loginFlowStoragePrefix(backend: string) {
  return `memova.login.v1:${backend}:`;
}

function flowKey(backend: string, returnPath: string) {
  return loginFlowStoragePrefix(backend) + encodeURIComponent(returnPath);
}

export function readEmailLoginFlow(
  backend: string,
  returnPath: string
): EmailLoginFlow | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(flowKey(backend, returnPath));
    if (!raw) return null;
    const flow = JSON.parse(raw) as EmailLoginFlow;
    if (
      typeof flow.email !== "string" ||
      !flow.challenge?.challenge_id ||
      !Number.isFinite(flow.resendAt) ||
      !Number.isFinite(Date.parse(flow.challenge.expires_at)) ||
      Date.parse(flow.challenge.expires_at) <= Date.now()
    ) {
      window.sessionStorage.removeItem(flowKey(backend, returnPath));
      return null;
    }
    return flow;
  } catch {
    return null;
  }
}

export function saveEmailLoginFlow(
  backend: string,
  returnPath: string,
  flow: EmailLoginFlow | null
) {
  try {
    const key = flowKey(backend, returnPath);
    if (flow) {
      const { dev_code: _code, ...challenge } = flow.challenge;
      window.sessionStorage.setItem(
        key,
        JSON.stringify({ ...flow, challenge })
      );
    } else {
      window.sessionStorage.removeItem(key);
    }
  } catch {
    // Storage is optional. Credentials and OTPs are never persisted here.
  }
}

export function clearEmailLoginFlows(backend: string) {
  try {
    const prefix = loginFlowStoragePrefix(backend);
    const keys = Array.from(
      { length: window.sessionStorage.length },
      (_, index) => window.sessionStorage.key(index)
    );
    for (const key of keys)
      if (key?.startsWith(prefix)) window.sessionStorage.removeItem(key);
  } catch {
    // Clearing the active in-memory session remains possible without storage.
  }
}

export function safeClientWebsite(value: string | null): string | undefined {
  try {
    const url = new URL(value || "");
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password
    )
      return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}
