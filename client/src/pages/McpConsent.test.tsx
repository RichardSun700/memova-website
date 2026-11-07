import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { parseHTML } from "linkedom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import McpConsent from "./McpConsent";
import McpSetupGuide from "@/components/account/McpSetupGuide";

const state = vi.hoisted(() => ({
  authenticated: true,
  navigate: vi.fn(),
  get: vi.fn(),
  approve: vi.fn(),
  deny: vi.fn(),
}));
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: state.authenticated,
    token: "test-session",
    user: {},
    workspace: {},
  }),
}));
vi.mock("wouter", () => ({
  useLocation: () => ["/mcp/oauth/consent", state.navigate],
}));
vi.mock("@/components/account/AccountShell", () => ({
  default: ({ title, subtitle, children, actions }: any) =>
    createElement("main", null, title, subtitle, actions, children),
}));
vi.mock("@/lib/api", () => ({
  getMcpAuthorizationRequest: (...args: unknown[]) => state.get(...args),
  approveMcpAuthorizationRequest: (...args: unknown[]) =>
    state.approve(...args),
  denyMcpAuthorizationRequest: (...args: unknown[]) => state.deny(...args),
}));

const detail = {
  id: "request-1",
  client_id: "client-1",
  client_name: "Example agent",
  client_uri: null,
  logo_uri: null,
  resource: "https://test.example/mcp/next",
  redirect_uri: "http://127.0.0.1:4321/callback",
  scopes: ["next.read"],
  status: "pending",
  expires_at: "2099-01-01T00:00:00Z",
};
const callback =
  "http://127.0.0.1:4321/callback?code=one-time-test-code&state=unchanged%2Bstate";
let root: Root | undefined;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  state.authenticated = true;
  state.navigate.mockReset();
  state.get.mockReset().mockResolvedValue(detail);
  state.approve.mockReset().mockResolvedValue({ redirect_uri: callback });
  state.deny.mockReset().mockResolvedValue({
    redirect_uri:
      "http://127.0.0.1:4321/callback?error=access_denied&state=unchanged",
  });
});
afterEach(async () => {
  if (root) await act(async () => root!.unmount());
  root = undefined;
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

async function mount() {
  const { document, window } = parseHTML(
    '<html><body><div id="root"></div></body></html>'
  );
  const assign = vi.fn();
  Object.assign(window, {
    location: {
      pathname: "/mcp/oauth/consent",
      search: "?request_id=request-1&lang=en",
      assign,
    },
    setTimeout,
    clearTimeout,
  });
  vi.stubGlobal("window", window);
  vi.stubGlobal("document", document);
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  root = createRoot(document.getElementById("root")!);
  await act(async () => root!.render(createElement(McpConsent)));
  const button = (text: string) =>
    Array.from(document.querySelectorAll("button")).find(
      item => item.textContent?.trim() === text
    )!;
  return { document, assign, button };
}

describe("MCP approval and current-agent verification", () => {
  it("shows return/reload/read verification before consent, with a persistent safe help link", async () => {
    const f = await mount();
    expect(f.document.body.textContent).toContain("original chat");
    expect(f.document.body.textContent).toContain("reload");
    expect(f.document.body.textContent).toContain("get_next_account");
    expect(f.document.body.textContent).toContain("search_next_data(limit=3)");
    const link = f.document.querySelector('a[href="/mcp/setup?lang=en"]')!;
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(state.approve).not.toHaveBeenCalled();
  });

  it("preserves the pending authorization through login without calling approval", async () => {
    state.authenticated = false;
    await mount();
    expect(state.navigate).toHaveBeenCalledWith(
      "/login?next=%2Fmcp%2Foauth%2Fconsent%3Frequest_id%3Drequest-1%26lang%3Den"
    );
    expect(state.get).not.toHaveBeenCalled();
    expect(state.approve).not.toHaveBeenCalled();
  });

  it("approves once, preserves the exact callback, and never claims callable tools", async () => {
    const f = await mount();
    await act(async () => f.button("Approve access").click());
    expect(f.document.body.textContent).toContain(
      "Access approved for Example agent"
    );
    expect(f.document.body.textContent).not.toContain("is connected to Memova");
    expect(f.document.body.textContent).not.toContain(
      "secure connection is ready"
    );
    expect(f.assign).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(3000));
    expect(f.assign).toHaveBeenCalledTimes(1);
    expect(f.assign).toHaveBeenCalledWith(callback);
    await act(async () => f.button("中文").click());
    await act(async () => vi.advanceTimersByTime(6000));
    expect(f.assign).toHaveBeenCalledTimes(1);
    expect(state.approve).toHaveBeenCalledTimes(1);
    expect(f.button("发送授权结果给 Agent").disabled).toBe(false);
  });

  it("keeps recovery visible when browser navigation throws, without reapproving", async () => {
    const f = await mount();
    f.assign.mockImplementation(() => {
      throw new Error("blocked navigation");
    });
    await act(async () => f.button("Approve access").click());
    await act(async () => vi.advanceTimersByTime(3000));
    expect(f.document.querySelector('[role="alert"]')?.textContent).toContain(
      "Check your agent first"
    );
    expect(f.button("Send authorization result to agent").disabled).toBe(false);
    await act(async () => vi.advanceTimersByTime(20000));
    expect(f.assign).toHaveBeenCalledTimes(1);
    expect(state.approve).toHaveBeenCalledTimes(1);
  });

  it("returns cancellation to the registered client without approving", async () => {
    const f = await mount();
    await act(async () => f.button("Cancel this connection").click());
    expect(f.assign).toHaveBeenCalledWith(
      "http://127.0.0.1:4321/callback?error=access_denied&state=unchanged"
    );
    expect(state.approve).not.toHaveBeenCalled();
  });

  it("does not approve expired requests", async () => {
    state.get.mockResolvedValue({ ...detail, status: "expired" });
    const f = await mount();
    expect(f.button("Approve access").disabled).toBe(true);
    expect(f.document.body.textContent).toContain(
      "start a new authorization request"
    );
    expect(state.approve).not.toHaveBeenCalled();
  });

  it("uses Next verification only for Next grants, with bilingual client guidance", () => {
    const next = renderToStaticMarkup(
      createElement(McpSetupGuide, {
        language: "zh",
        client: "codex",
        detailed: true,
      })
    );
    expect(next).toContain("Settings → MCP servers");
    expect(next).toContain("get_next_account");
    expect(next).toContain("本页面无法检查");
    const legacy = renderToStaticMarkup(
      createElement(McpSetupGuide, { language: "en", next: false })
    );
    expect(legacy).not.toContain("get_next_account");
    expect(legacy).toContain("permitted by this authorization");
  });
});
