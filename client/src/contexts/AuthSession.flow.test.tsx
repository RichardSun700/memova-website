import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { parseHTML } from "linkedom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AUTH_BACKEND, AuthProvider, useAuth } from "./AuthContext";

const mocks = vi.hoisted(() => ({
  me: vi.fn(),
  logout: vi.fn(),
  expired: null as null | ((token: string) => void),
}));
vi.mock("@/lib/api", async original => ({
  ...(await original<object>()),
  getCurrentUser: mocks.me,
  logoutSession: mocks.logout,
  subscribeToUnauthorized: (callback: (token: string) => void) => {
    mocks.expired = callback;
    return () => {
      mocks.expired = null;
    };
  },
}));
const roots: Root[] = [];
let auth: ReturnType<typeof useAuth>;
const response = {
  access_token: "fixture-token",
  expires_at: new Date(Date.now() + 3600000).toISOString(),
  token_type: "bearer" as const,
  user: {
    id: "fixture-user",
    email: "person@example.com",
    display_name: "Person",
    auth_provider: "email",
    avatar_url: "https://example.com/temporary",
  },
  default_workspace: {
    id: "fixture-workspace",
    name: "Workspace",
    slug: "workspace",
    type: "personal",
  },
};
beforeEach(() => {
  vi.clearAllMocks();
  mocks.me.mockResolvedValue({
    user: response.user,
    default_workspace: response.default_workspace,
  });
});
afterEach(async () => {
  for (const root of roots.splice(0)) await act(() => root.unmount());
  vi.unstubAllGlobals();
});

async function mount(initial?: Record<string, string>) {
  const { window, document } = parseHTML(
    '<html><body><div id="root"></div></body></html>'
  );
  const tab = new Map(Object.entries(initial || {}));
  const legacy = new Map([["memova.auth.v1", JSON.stringify(response)]]);
  const storage = (map: Map<string, string>) => ({
    getItem: (k: string) => map.get(k) || null,
    setItem: (k: string, v: string) => map.set(k, v),
    removeItem: (k: string) => map.delete(k),
    key: (index: number) => Array.from(map.keys())[index],
    get length() {
      return map.size;
    },
  });
  Object.assign(window, {
    sessionStorage: storage(tab),
    localStorage: storage(legacy),
  });
  vi.stubGlobal("window", window);
  vi.stubGlobal("document", document);
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  function Probe() {
    auth = useAuth();
    return createElement(
      "span",
      null,
      auth.isAuthenticated ? "signed-in" : "signed-out"
    );
  }
  const root = createRoot(document.getElementById("root")!);
  roots.push(root);
  await act(async () => {
    root.render(createElement(AuthProvider, null, createElement(Probe)));
  });
  return { tab, legacy };
}

describe("website session lifecycle", () => {
  it("uses a tab-scoped backend-bound session and discards an unscoped legacy token", async () => {
    const f = await mount();
    expect(auth.isAuthenticated).toBe(false);
    expect(f.legacy.size).toBe(0);
    await act(async () => {
      auth.setSessionFromTokenResponse(response);
    });
    expect(auth.isAuthenticated).toBe(true);
    const saved = JSON.parse(f.tab.get("memova.auth.v2:" + AUTH_BACKEND)!);
    expect(saved.backend).toBe(AUTH_BACKEND);
    expect(saved.user.avatar_url).toBeNull();
    expect(f.legacy.size).toBe(0);
  });

  it("rejects a stored token from a mismatched backend", async () => {
    const f = await mount({
      ["memova.auth.v2:" + AUTH_BACKEND]: JSON.stringify({
        ...response,
        backend: "isolated-test:https://other.example",
      }),
    });
    expect(auth.isAuthenticated).toBe(false);
    expect(f.tab.size).toBe(0);
    expect(mocks.me).not.toHaveBeenCalled();
  });

  it("clears the active token on 401 while ignoring errors from an older account", async () => {
    await mount();
    await act(async () => {
      auth.setSessionFromTokenResponse(response);
    });
    await act(async () => {
      mocks.expired?.("other-token");
    });
    expect(auth.isAuthenticated).toBe(true);
    await act(async () => {
      mocks.expired?.("fixture-token");
    });
    expect(auth.isAuthenticated).toBe(false);
  });

  it("keeps an existing session when profile refresh is offline and clears it locally on logout", async () => {
    mocks.me.mockRejectedValue(new TypeError("offline"));
    const f = await mount({
      ["memova.auth.v2:" + AUTH_BACKEND]: JSON.stringify({
        ...response,
        backend: AUTH_BACKEND,
      }),
    });
    expect(auth.isAuthenticated).toBe(true);
    mocks.logout.mockRejectedValue(new TypeError("offline"));
    await act(async () => {
      await auth.logout();
    });
    expect(auth.isAuthenticated).toBe(false);
    expect(f.tab.size).toBe(0);
    expect(mocks.logout).toHaveBeenCalledWith("fixture-token");
  });
});
