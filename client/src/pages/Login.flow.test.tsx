import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { parseHTML } from "linkedom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Login from "./Login";

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  start: vi.fn(),
  verify: vi.fn(),
  reviewer: vi.fn(),
  profile: vi.fn(),
  auth: {
    isAuthenticated: false,
    session: null,
    user: null,
    setSessionFromTokenResponse: vi.fn(),
  },
  config: {
    environment: "production",
    apiBaseUrl: "https://api.memova.ai",
    oauthApiBaseUrl: "https://api.memova.ai",
  },
}));
vi.mock("wouter", () => ({
  useLocation: () => ["/mcp/login", mocks.navigate],
}));
vi.mock("@/components/SiteHeader", () => ({ default: () => null }));
vi.mock("@/components/SiteFooter", () => ({ default: () => null }));
vi.mock("@/contexts/AuthContext", () => ({
  AUTH_BACKEND: "production:https://api.memova.ai",
  useAuth: () => mocks.auth,
}));
vi.mock("@/lib/mcpDeployment", () => ({ MCP_DEPLOYMENT: mocks.config }));
vi.mock("@/seo/legalLanguage", () => ({ useLegalLanguage: () => "en" }));
vi.mock("@/lib/api", async original => ({
  ...(await original<object>()),
  startEmailLogin: mocks.start,
  verifyEmailLogin: mocks.verify,
  loginWithReviewCredentials: mocks.reviewer,
  updateCurrentUserProfile: mocks.profile,
}));
// linkedom supplies input events without a browser value tracker.
vi.mock("@/components/ui/input", () => ({
  Input: ({ onChange, ...props }: any) =>
    createElement("input", { ...props, onInput: onChange }),
}));

const roots: Root[] = [];
const tokenResponse = {
  access_token: "fixture-token",
  expires_at: "2099-01-01T00:00:00.000Z",
  token_type: "bearer",
  user: { id: "fixture-user", email: "person@example.com", display_name: null },
  default_workspace: { id: "workspace" },
};
beforeEach(() => {
  vi.clearAllMocks();
  mocks.config.environment = "production";
  mocks.start.mockResolvedValue({
    challenge_id: "fixture-challenge",
    expires_at: "2099-01-01T00:00:00.000Z",
    delivery_channel: "email",
    delivery_status: "accepted",
    retry_after_seconds: 30,
    dev_code: "654321",
  });
  mocks.verify.mockResolvedValue(tokenResponse);
});
afterEach(async () => {
  for (const root of roots.splice(0)) await act(() => root.unmount());
  vi.unstubAllGlobals();
});

async function mount(
  next = "/mcp/oauth/consent?request_id=fixture-request&lang=en",
  stored = new Map<string, string>(),
  pathname = "/mcp/login"
) {
  const { document, window } = parseHTML(
    '<html><head></head><body><div id="root"></div></body></html>'
  );
  Object.assign(window, {
    location: new URL(
      "https://memova.ai" + pathname + "?next=" + encodeURIComponent(next)
    ),
    sessionStorage: {
      getItem: (key: string) => stored.get(key) || null,
      setItem: (key: string, value: string) => stored.set(key, value),
      removeItem: (key: string) => stored.delete(key),
    },
  });
  vi.stubGlobal("window", window);
  vi.stubGlobal("document", document);
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const root = createRoot(document.getElementById("root")!);
  roots.push(root);
  await act(() => root.render(createElement(Login)));
  async function fill(id: string, value: string) {
    const input = document.getElementById(id) as HTMLInputElement;
    await act(async () => {
      input.value = value;
      input.dispatchEvent(new window.Event("input", { bubbles: true }));
    });
  }
  async function submit() {
    await act(async () => {
      document
        .querySelector("form")!
        .dispatchEvent(
          new window.Event("submit", { bubbles: true, cancelable: true })
        );
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }
  return { document, window, stored, fill, submit };
}

describe("email login to the original MCP request", () => {
  it("returns verified users to the same consent request without a nickname gate or compiled dev code", async () => {
    const f = await mount();
    expect(f.document.body.textContent).not.toContain("Use test credentials");
    await f.fill("login-email", "person@example.com");
    await f.submit();
    expect(mocks.start).toHaveBeenCalledWith("person@example.com");
    expect(f.document.body.textContent).not.toContain("654321");
    await f.fill("login-code", "123456");
    await f.submit();
    expect(mocks.verify).toHaveBeenCalledWith(
      "fixture-challenge",
      "123456",
      undefined
    );
    expect(mocks.auth.setSessionFromTokenResponse).toHaveBeenCalledWith(
      tokenResponse
    );
    expect(mocks.navigate).toHaveBeenCalledWith(
      "/mcp/oauth/consent?request_id=fixture-request&lang=en"
    );
    expect(mocks.profile).not.toHaveBeenCalled();
    expect(f.stored.size).toBe(0);
  });

  it("recovers the correct challenge after refresh and displays resend cooldown", async () => {
    const first = await mount();
    await first.fill("login-email", "person@example.com");
    await first.submit();
    expect(first.document.body.textContent).toContain("Resend in 30s");
    const recovered = await mount(undefined, first.stored);
    expect(recovered.document.getElementById("login-code")).not.toBeNull();
    expect(recovered.document.getElementById("login-email")).toBeNull();
    expect(recovered.document.body.textContent).toContain("person@example.com");
    expect(Array.from(first.stored.values()).join()).not.toContain("654321");
  });

  it("prevents duplicate code sends and reports uncertain delivery without asserting delivery success", async () => {
    let resolve!: (result: any) => void;
    mocks.start.mockImplementation(
      () =>
        new Promise(done => {
          resolve = done;
        })
    );
    const f = await mount();
    await f.fill("login-email", "person@example.com");
    await f.submit();
    await f.submit();
    expect(mocks.start).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolve({
        challenge_id: "pending",
        expires_at: "2099-01-01T00:00:00.000Z",
        delivery_status: "unknown",
        delivery_channel: "email",
        dev_code: null,
      });
      await new Promise(done => setTimeout(done, 0));
    });
    expect(f.document.body.textContent).toContain(
      "Delivery is being processed"
    );
    const resend = Array.from(f.document.querySelectorAll("button")).find(button =>
      button.textContent?.startsWith("Resend")
    ) as HTMLButtonElement;
    expect(resend.disabled).toBe(true);
  });

  it("preserves the ordinary profile nickname flow while rejecting an external return", async () => {
    const f = await mount(
      "https://elsewhere.example/steal",
      undefined,
      "/login"
    );
    await f.fill("login-email", "person@example.com");
    await f.submit();
    await f.fill("login-code", "123456");
    await f.submit();
    expect(f.document.getElementById("nickname")).not.toBeNull();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
});
