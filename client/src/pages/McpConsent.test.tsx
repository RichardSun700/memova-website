import { act, createElement, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { parseHTML } from "linkedom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import McpConsent, {
  authorizationCallback,
  consentSurface,
  isSafeMcpCallback,
} from "./McpConsent";
import McpSetup from "./McpSetup";
import { ApiError, type McpAuthorizationRequest } from "@/lib/api";
import { buildMcpSetupPrompt } from "@/components/account/McpSetupGuide";

const fakes = vi.hoisted(() => ({
  get: vi.fn(),
  approve: vi.fn(),
  deny: vi.fn(),
  navigate: vi.fn(),
  language: "en" as "en" | "zh",
  auth: {
    isAuthenticated: true,
    token: "synthetic-session",
    user: { email: "fixture@example.test", display_name: "Fixture user" },
    workspace: { name: "Personal workspace" },
    clearSession: vi.fn(),
    logout: vi.fn(async () => {}),
  },
}));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => fakes.auth }));
vi.mock("wouter", () => ({
  useLocation: () => ["/mcp/oauth/consent", fakes.navigate],
  useSearch: () => window.location.search.slice(1),
}));
vi.mock("@/components/account/AccountShell", () => ({
  default: ({
    title,
    children,
    actions,
  }: {
    title: string;
    children: ReactNode;
    actions: ReactNode;
  }) => (
    <main>
      <h1>{title}</h1>
      {actions}
      {children}
    </main>
  ),
}));
vi.mock("@/lib/mcpDeployment", () => ({
  MCP_DEPLOYMENT: {
    environment: "production",
    apiBaseUrl: "https://api.memova.ai",
    oauthApiBaseUrl: "https://api.memova.ai",
    serverUrl: "https://api.memova.ai/v2/mcp",
  },
}));
vi.mock("@/seo/legalLanguage", async importOriginal => {
  const actual = await importOriginal<typeof import("@/seo/legalLanguage")>();
  return {
    ...actual,
    useLegalLanguage: () => fakes.language,
    readLegalLanguage: () => fakes.language,
    setLegalLanguage: vi.fn(),
  };
});
vi.mock("@/lib/api", async importOriginal => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    getMcpAuthorizationRequest: fakes.get,
    approveMcpAuthorizationRequest: fakes.approve,
    denyMcpAuthorizationRequest: fakes.deny,
  };
});

const request = (
  patch: Partial<McpAuthorizationRequest> = {}
): McpAuthorizationRequest => ({
  id: "fixture-request",
  client_id: "fixture-client",
  client_name: "Codex",
  client_uri: null,
  logo_uri: null,
  redirect_uri: "http://127.0.0.1:1455/auth/callback",
  resource: "https://api.memova.ai/v2/mcp",
  scopes: ["next.read"],
  status: "pending",
  expires_at: "2030-01-01T00:00:00Z",
  created_at: null,
  ...patch,
});
const approved = (pending = request()) => ({
  redirect_uri: `${pending.redirect_uri}?code=synthetic-code&state=synthetic-state&iss=https%3A%2F%2Fapi.memova.ai`,
  authorization_request: { ...pending, status: "approved" },
});
const roots: Root[] = [];

beforeEach(() => {
  vi.useFakeTimers();
  fakes.get.mockReset().mockResolvedValue(request());
  fakes.approve.mockReset().mockResolvedValue(approved());
  fakes.deny.mockReset();
  fakes.navigate.mockReset();
  fakes.language = "en";
  fakes.auth.isAuthenticated = true;
  fakes.auth.token = "synthetic-session";
  fakes.auth.clearSession.mockReset();
  fakes.auth.logout.mockReset().mockResolvedValue(undefined);
});
afterEach(async () => {
  for (const root of roots.splice(0)) await act(() => root.unmount());
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

async function fixture(
  Component = McpConsent,
  query = "?request_id=fixture-request"
) {
  const { document, window } = parseHTML(
    '<html><head></head><body><div id="root"></div></body></html>'
  );
  const location = Object.assign(
    new URL(`/mcp/oauth/consent${query}`, "https://memova.ai"),
    { assign: vi.fn() }
  );
  Object.assign(window, {
    location,
    setTimeout,
    clearTimeout,
    history: { state: null, replaceState: vi.fn() },
  });
  vi.stubGlobal("window", window);
  vi.stubGlobal("document", document);
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const root = createRoot(document.getElementById("root")!);
  roots.push(root);
  await act(async () => {
    root.render(createElement(Component));
  });
  const click = async (label: string) => {
    const button = Array.from(document.querySelectorAll("button")).find(
      button => button.textContent?.trim() === label
    );
    expect(button, label).toBeTruthy();
    await act(async () => button!.click());
  };
  return { document, location, root, click };
}

describe("MCP consent boundaries", () => {
  it("accepts only exact Next resources with next.read and keeps legacy access separate", () => {
    expect(consentSurface(request())).toBe("next");
    expect(
      consentSurface(request({ resource: "https://api.memova.ai/mcp/next" }))
    ).toBe("next");
    expect(
      consentSurface(
        request({
          resource: "https://api.memova.ai/mcp",
          scopes: ["notes.read", "actions.write"],
        })
      )
    ).toBe("legacy");
    for (const value of [
      request({ scopes: ["next.read", "notes.write"] }),
      request({ resource: "https://other.example/v2/mcp" }),
      request({ resource: "https://api.memova.ai/v2/mcp/" }),
      request({ resource: "https://api.memova.ai/mcp" }),
      request({ scopes: [] }),
    ])
      expect(consentSurface(value)).toBe("unsupported");
  });
  it("retains published legacy read, export and conversation permissions", () => {
    expect(
      consentSurface(
        request({
          resource: "https://api.memova.ai/mcp",
          scopes: [
            "resources.read",
            "resources.export",
            "sparks.read",
            "conversations.read",
            "conversations.write",
            "conversations.delete",
          ],
        })
      )
    ).toBe("legacy");
  });
  it("permits HTTPS and exact HTTP loopback callbacks", () => {
    for (const value of [
      "https://client.example/callback",
      "http://127.0.0.1:1455/callback",
      "http://localhost:1455/callback",
      "http://[::1]:1455/callback",
    ])
      expect(isSafeMcpCallback(value)).toBe(true);
    for (const value of [
      "javascript:alert(1)",
      "codex://callback",
      "http://client.example/callback",
      "http://localhost.evil.example/callback",
      "https://user:password@client.example/callback",
      "//client.example/callback",
      " https://client.example/callback",
    ])
      expect(isSafeMcpCallback(value)).toBe(false);
  });
  it("preserves the server callback exactly and rejects mismatched authorization responses", () => {
    const response = approved();
    expect(authorizationCallback(response, request(), "approve")).toBe(
      response.redirect_uri
    );
    for (const value of [
      null,
      {
        ...response,
        authorization_request: {
          ...response.authorization_request,
          id: "another",
        },
      },
      {
        ...response,
        authorization_request: {
          ...response.authorization_request,
          resource: "https://other.example/v2/mcp",
        },
      },
      { ...response, redirect_uri: "https://other.example/callback" },
      {
        ...response,
        authorization_request: {
          ...response.authorization_request,
          status: "pending",
        },
      },
    ])
      expect(() =>
        authorizationCallback(value, request(), "approve")
      ).toThrow();
  });
  it("validates denial responses without converting them into an approval", async () => {
    const pending = request();
    const response = {
      redirect_uri: `${pending.redirect_uri}?error=access_denied&state=fixture`,
      authorization_request: { ...pending, status: "denied" },
    };
    expect(authorizationCallback(response, pending, "deny")).toBe(
      response.redirect_uri
    );
    expect(() => authorizationCallback(response, pending, "approve")).toThrow();
    fakes.deny.mockResolvedValue(response);
    const f = await fixture();
    await f.click("Cancel this connection");
    expect(fakes.deny).toHaveBeenCalledOnce();
    expect(f.document.body.textContent).toContain(
      "Your agent will receive access_denied"
    );
    expect(f.document.body.textContent).not.toContain(
      "After approval, return to your original chat"
    );
    await act(async () => vi.advanceTimersByTime(4000));
    expect(f.location.assign).toHaveBeenCalledWith(response.redirect_uri);
  });
  it("shows missing-request recovery without making an API request", async () => {
    const f = await fixture(
      McpConsent,
      "?redirect_uri=https%3A%2F%2Fevil.example"
    );
    expect(f.document.body.textContent).toContain("start authentication there");
    expect(fakes.get).not.toHaveBeenCalled();
    expect(f.location.assign).not.toHaveBeenCalled();
  });
  it("returns an unauthenticated account to the original consent request", async () => {
    fakes.auth.isAuthenticated = false;
    const f = await fixture();
    expect(fakes.get).not.toHaveBeenCalled();
    const next = new URL(
      fakes.navigate.mock.calls[0][0],
      "https://memova.ai"
    ).searchParams.get("next");
    expect(next).toBe("/mcp/oauth/consent?request_id=fixture-request");
    expect(f.location.assign).not.toHaveBeenCalled();
  });
  it("shows six read-only data types and return instructions before approval", async () => {
    const f = await fixture();
    const body = f.document.body.textContent || "";
    for (const text of [
      "fixture@example.test",
      "next.read",
      "hour_note",
      "inspiration",
      "timeline_day",
      "memory",
      "health_sample",
      "recording_marker",
      "no Pro required",
      "After approval, return to your original chat",
      "Request expires",
    ])
      expect(body).toContain(text);
    expect(fakes.approve).not.toHaveBeenCalled();
  });
  it("blocks mismatched scopes while showing the actual request", async () => {
    fakes.get.mockResolvedValue(
      request({ scopes: ["next.read", "notes.write"] })
    );
    const f = await fixture();
    expect(f.document.body.textContent).toContain("next.read · notes.write");
    expect(
      Array.from(f.document.querySelectorAll("button")).find(
        b => b.textContent?.trim() === "Approve access"
      )?.disabled
    ).toBe(true);
  });
  it("disables expired and already consumed requests", async () => {
    fakes.get.mockResolvedValue(request({ status: "consumed" }));
    const f = await fixture();
    expect(f.document.body.textContent).toContain("already been used");
    expect(
      Array.from(f.document.querySelectorAll("button")).find(
        b => b.textContent?.trim() === "Approve access"
      )?.disabled
    ).toBe(true);
  });
  it("posts approval once and sends only the authenticated callback once", async () => {
    const f = await fixture();
    await f.click("Approve access");
    expect(fakes.approve).toHaveBeenCalledOnce();
    expect(f.document.querySelector("h1")?.textContent).toBe(
      "Authorization approved"
    );
    expect(f.document.body.textContent).toContain(
      "If the tools are missing or you still see the previous account, refresh the MCP connection and try again."
    );
    expect(f.document.body.textContent).not.toContain("tools are loaded");
    await f.click("Return to agent");
    await act(async () => vi.advanceTimersByTime(4000));
    expect(f.location.assign).toHaveBeenCalledOnce();
    expect(f.location.assign).toHaveBeenCalledWith(approved().redirect_uri);
  });
  it("keeps the validated callback and submission lock across a language change", async () => {
    const f = await fixture();
    await f.click("Approve access");
    fakes.language = "zh";
    f.location.search = "?request_id=fixture-request&lang=zh";
    await act(async () => f.root.render(createElement(McpConsent)));
    expect(f.document.querySelector("h1")?.textContent).toBe("授权已批准");
    expect(f.document.body.textContent).toContain(
      "若工具尚未出现或账号未更新，请刷新 MCP 连接后重试。"
    );
    expect(fakes.get).toHaveBeenCalledOnce();
    await act(async () => vi.advanceTimersByTime(4000));
    expect(fakes.approve).toHaveBeenCalledOnce();
    expect(f.location.assign).toHaveBeenCalledOnce();
    expect(f.location.assign).toHaveBeenCalledWith(approved().redirect_uri);
  });
  it("keeps an uncertain approval outcome locked against repeated POSTs", async () => {
    fakes.approve.mockRejectedValue(new Error("Network unavailable"));
    const f = await fixture();
    await f.click("Approve access");
    await f.click("Approve access");
    expect(fakes.approve).toHaveBeenCalledOnce();
    expect(f.document.body.textContent).toContain("Check the original agent");
    expect(f.location.assign).not.toHaveBeenCalled();
  });
  it("clears an unauthorized session and resumes login with the request preserved", async () => {
    fakes.get.mockRejectedValue(
      new ApiError({
        status: 401,
        code: "unauthorized",
        message: "Expired session",
      })
    );
    await fixture();
    expect(fakes.auth.clearSession).toHaveBeenCalledOnce();
    expect(fakes.navigate.mock.calls[0][0]).toContain(
      "request_id%3Dfixture-request"
    );
  });
  it("switches accounts with an explicit logout and no automatic approval", async () => {
    const f = await fixture();
    await f.click("Switch account");
    expect(fakes.auth.logout).toHaveBeenCalledOnce();
    expect(fakes.navigate.mock.calls[0][0]).toContain(
      "request_id%3Dfixture-request"
    );
    expect(fakes.approve).not.toHaveBeenCalled();
  });
  it("offers a consistent installation prompt with five tools and current date-query fields", async () => {
    const prompt = buildMcpSetupPrompt("en");
    for (const text of [
      "https://api.memova.ai/v2/mcp",
      "next.read",
      "get_next_account",
      "search_next_data",
      "get_next_data",
      "get_next_usage",
      "create_next_download",
      "query_time_zone",
      "stored_time_zone",
    ])
      expect(prompt).toContain(text);
    const f = await fixture(McpSetup);
    expect(f.document.body.textContent).toContain("First add and authenticate");
    expect(f.document.body.textContent).toContain(
      "Tools and reading verification"
    );
  });
  it("uses the shared Chinese language for consent and its recovery links", async () => {
    fakes.language = "zh";
    const f = await fixture();
    expect(f.document.body.textContent).toContain("确认 Agent 的访问权限");
    expect(
      f.document
        .querySelector('a[href^="/connected-clients"]')
        ?.getAttribute("href")
    ).toContain("lang=zh");
  });
});
