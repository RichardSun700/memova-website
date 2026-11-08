import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { parseHTML } from "linkedom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ConnectedClients from "./ConnectedClients";

const mocks = vi.hoisted(() => ({
  list: vi.fn(),
  revoke: vi.fn(),
  navigate: vi.fn(),
  auth: { isAuthenticated: true, token: "fixture-token" },
}));
vi.mock("wouter", () => ({
  useLocation: () => ["/connected-clients", mocks.navigate],
}));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => mocks.auth }));
vi.mock("@/seo/legalLanguage", () => ({ useLegalLanguage: () => "en" }));
vi.mock("@/components/account/AccountShell", () => ({
  default: ({ title, actions, children }: any) =>
    createElement(
      "main",
      null,
      createElement("h1", null, title),
      actions,
      children
    ),
}));
vi.mock("@/lib/api", () => ({
  listMcpConnections: mocks.list,
  revokeMcpConnection: mocks.revoke,
}));
const fixture = (id: string) => ({
  connection_id: id,
  client_id: id,
  client_name: id,
  client_uri: "javascript:alert(1)",
  logo_uri: null,
  scopes: ["next.read"],
  resource: "https://api.memova.ai/v2/mcp",
  connected_at: "2026-11-07T03:00:00Z",
  last_used_at: null,
  access_expires_at: null,
  revoked_at: null,
  status: "active",
});
const roots: Root[] = [];
beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.isAuthenticated = true;
  mocks.list.mockResolvedValue([fixture("one"), fixture("two")]);
});
afterEach(async () => {
  for (const root of roots.splice(0)) await act(() => root.unmount());
  vi.unstubAllGlobals();
});
async function mount() {
  const { window, document } = parseHTML(
    '<html><body><div id="root"></div></body></html>'
  );
  Object.assign(window, { confirm: vi.fn(() => true) });
  vi.stubGlobal("window", window);
  vi.stubGlobal("document", document);
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const root = createRoot(document.getElementById("root")!);
  roots.push(root);
  await act(async () => root.render(createElement(ConnectedClients)));
  return { document, window };
}

describe("MCP connection management", () => {
  it("revokes only the chosen connection after the server confirms it", async () => {
    const f = await mount();
    const buttons = Array.from(f.document.querySelectorAll("button")).filter(b =>
      b.textContent?.includes("Revoke")
    );
    expect(f.document.body.textContent).toContain(
      "https://api.memova.ai/v2/mcp"
    );
    expect(f.document.querySelector('a[href^="javascript:"]')).toBeNull();
    mocks.revoke.mockResolvedValue({
      ...fixture("one"),
      status: "revoked",
      revoked_at: "2026-11-07T04:00:00Z",
    });
    await act(async () => {
      buttons[0].click();
      await new Promise(done => setTimeout(done, 0));
    });
    expect(mocks.revoke).toHaveBeenCalledWith("fixture-token", "one");
    expect(buttons[0].disabled).toBe(true);
    expect(buttons[1].disabled).toBe(false);
  });
  it("shows a recoverable loading error without claiming the account has no connections", async () => {
    mocks.list.mockRejectedValue(new Error("Could not reach the service."));
    const f = await mount();
    expect(f.document.querySelector('[role="alert"]')?.textContent).toBe(
      "Could not reach the service."
    );
    expect(f.document.body.textContent).not.toContain("No connected clients");
    mocks.list.mockResolvedValue([]);
    await act(async () => {
      f.document.querySelector("button")!.click();
      await new Promise(done => setTimeout(done, 0));
    });
    expect(f.document.body.textContent).toContain("No connected clients");
  });
});
