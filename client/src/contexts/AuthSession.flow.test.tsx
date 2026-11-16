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
const key = "memova.auth.v2:" + AUTH_BACKEND;
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
  vi.useFakeTimers();
  vi.clearAllMocks();
  mocks.me.mockResolvedValue({
    user: response.user,
    default_workspace: response.default_workspace,
  });
});
afterEach(async () => {
  for (const root of roots.splice(0)) await act(() => root.unmount());
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

async function mount(
  initial?: Record<string, string>,
  options: {
    shared?: Map<string, string>;
    blockShared?: boolean;
    blockAll?: boolean;
    readOnlyShared?: boolean;
  } = {}
) {
  const { window, document } = parseHTML(
    '<html><body><div id="root"></div></body></html>'
  );
  const tab = new Map(Object.entries(initial || {}));
  const legacy =
    options.shared || new Map([["memova.auth.v1", JSON.stringify(response)]]);
  const storage = (
    map: Map<string, string>,
    blocked = false,
    readOnly = false
  ) => ({
    getItem: (k: string) => {
      if (blocked) throw new Error("Storage unavailable");
      return map.get(k) ?? null;
    },
    setItem: (k: string, v: string) => {
      if (blocked || readOnly) throw new Error("Storage unavailable");
      map.set(k, v);
    },
    removeItem: (k: string) => {
      if (blocked || readOnly) throw new Error("Storage unavailable");
      map.delete(k);
    },
    key: (index: number) => Array.from(map.keys())[index],
    get length() {
      return map.size;
    },
  });
  Object.assign(window, {
    sessionStorage: storage(tab, options.blockAll),
    localStorage: storage(
      legacy,
      options.blockShared || options.blockAll,
      options.readOnlyShared
    ),
    setTimeout,
    clearTimeout,
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
  return {
    tab,
    legacy,
    window,
    root,
    storage,
    async notify(
      type: "storage" | "focus" | "pageshow",
      eventKey: string | null = key
    ) {
      const event = new window.Event(type);
      if (type === "storage")
        Object.defineProperty(event, "key", { value: eventKey });
      await act(async () => window.dispatchEvent(event));
    },
  };
}

describe("website session lifecycle", () => {
  it("persists a backend-bound shared session and discards an unscoped legacy token", async () => {
    const f = await mount();
    expect(auth.isAuthenticated).toBe(false);
    expect(f.legacy.size).toBe(0);
    await act(async () => {
      auth.setSessionFromTokenResponse(response);
    });
    expect(auth.isAuthenticated).toBe(true);
    const saved = JSON.parse(f.legacy.get(key)!);
    expect(saved.backend).toBe(AUTH_BACKEND);
    expect(saved.user.avatar_url).toBeNull();
    expect(f.tab.has(key)).toBe(false);
    expect(auth.user?.avatar_url).toBe(response.user.avatar_url);
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
    expect(f.legacy.get(key)).toBe("null");
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
    expect(f.legacy.get(key)).toBe("null");
    expect(mocks.logout).toHaveBeenCalledWith("fixture-token");
  });

  it("restores a shared login with an empty tab store", async () => {
    await mount(undefined, {
      shared: new Map([
        [key, JSON.stringify({ ...response, backend: AUTH_BACKEND })],
      ]),
    });
    expect(auth.user?.id).toBe(response.user.id);
  });

  it("migrates a valid old tab session but respects a shared logout tombstone", async () => {
    const f = await mount({
      [key]: JSON.stringify({ ...response, backend: AUTH_BACKEND }),
    });
    expect(auth.isAuthenticated).toBe(true);
    expect(f.tab.has(key)).toBe(false);
    expect(JSON.parse(f.legacy.get(key)!).backend).toBe(AUTH_BACKEND);
    f.legacy.set(key, "null");
    f.tab.set(key, JSON.stringify({ ...response, backend: AUTH_BACKEND }));
    await f.notify("focus");
    expect(auth.isAuthenticated).toBe(false);
    expect(f.tab.has(key)).toBe(false);
    expect(f.legacy.get(key)).toBe("null");
  });

  it.each(["storage", "focus", "pageshow"] as const)(
    "synchronizes login, account changes and logout on %s",
    async event => {
      const f = await mount();
      f.legacy.set(key, JSON.stringify({ ...response, backend: AUTH_BACKEND }));
      await f.notify(event);
      expect(auth.isAuthenticated).toBe(true);
      const next = {
        ...response,
        access_token: "next-token",
        backend: AUTH_BACKEND,
      };
      f.legacy.set(key, JSON.stringify(next));
      await f.notify(event);
      expect(auth.token).toBe("next-token");
      f.legacy.set(key, "null");
      await f.notify(event);
      expect(auth.isAuthenticated).toBe(false);
    }
  );

  it("ignores unrelated storage events and synchronizes a cleared shared store", async () => {
    const f = await mount({
      [key]: JSON.stringify({ ...response, backend: AUTH_BACKEND }),
    });
    f.legacy.set(key, "null");
    await f.notify("storage", "other-backend");
    expect(auth.isAuthenticated).toBe(true);
    f.legacy.clear();
    await f.notify("storage", null);
    expect(auth.isAuthenticated).toBe(false);
  });

  it("preserves the temporary avatar when another tab updates the same user's profile", async () => {
    const f = await mount({
      [key]: JSON.stringify({ ...response, backend: AUTH_BACKEND }),
    });
    const next = JSON.parse(f.legacy.get(key)!);
    next.user.display_name = "Updated name";
    f.legacy.set(key, JSON.stringify(next));
    await f.notify("focus");
    expect(auth.user?.display_name).toBe("Updated name");
    expect(auth.user?.avatar_url).toBe(response.user.avatar_url);
    expect(mocks.me).toHaveBeenCalledOnce();
  });

  it("ignores stale 401s and targeted clears after another tab changes account", async () => {
    const f = await mount({
      [key]: JSON.stringify({ ...response, backend: AUTH_BACKEND }),
    });
    f.legacy.set(
      key,
      JSON.stringify({
        ...response,
        access_token: "next-token",
        backend: AUTH_BACKEND,
      })
    );
    await act(async () => mocks.expired?.("fixture-token"));
    expect(auth.token).toBe("next-token");
    await act(async () => auth.clearSession("fixture-token"));
    expect(auth.token).toBe("next-token");
    await act(async () => mocks.expired?.("next-token"));
    expect(auth.isAuthenticated).toBe(false);
    expect(f.legacy.get(key)).toBe("null");
  });

  it("does not let a late profile refresh overwrite a newer account or revive a logout", async () => {
    let resolveProfile!: (value: unknown) => void;
    mocks.me.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolveProfile = resolve;
        })
    );
    const f = await mount({
      [key]: JSON.stringify({ ...response, backend: AUTH_BACKEND }),
    });
    f.legacy.set(
      key,
      JSON.stringify({
        ...response,
        access_token: "next-token",
        backend: AUTH_BACKEND,
      })
    );
    await act(async () =>
      resolveProfile({
        user: response.user,
        default_workspace: response.default_workspace,
      })
    );
    expect(auth.token).toBe("next-token");
    mocks.me.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolveProfile = resolve;
        })
    );
    let refresh!: Promise<void>;
    await act(async () => {
      refresh = auth.refreshUser();
    });
    f.legacy.set(key, "null");
    await act(async () => {
      resolveProfile({
        user: response.user,
        default_workspace: response.default_workspace,
      });
      await refresh;
    });
    expect(auth.isAuthenticated).toBe(false);
    expect(f.legacy.get(key)).toBe("null");
  });

  it("expires the active shared session at its deadline", async () => {
    const expires_at = new Date(Date.now() + 1000).toISOString();
    const f = await mount({
      [key]: JSON.stringify({ ...response, expires_at, backend: AUTH_BACKEND }),
    });
    await act(async () => vi.advanceTimersByTime(1001));
    expect(auth.isAuthenticated).toBe(false);
    expect(f.legacy.get(key)).toBe("null");
  });

  it("expires a shared session without erasing a newer account", async () => {
    const expires_at = new Date(Date.now() + 1000).toISOString();
    const f = await mount({
      [key]: JSON.stringify({ ...response, expires_at, backend: AUTH_BACKEND }),
    });
    f.legacy.set(
      key,
      JSON.stringify({
        ...response,
        access_token: "next-token",
        backend: AUTH_BACKEND,
      })
    );
    await act(async () => vi.advanceTimersByTime(1001));
    expect(auth.token).toBe("next-token");
    vi.setSystemTime(Date.parse(response.expires_at) + 1);
    await f.notify("pageshow");
    expect(auth.isAuthenticated).toBe(false);
    expect(f.legacy.get(key)).toBe("null");
  });

  it.each(["blockShared", "blockAll"] as const)(
    "keeps the current tab usable with %s",
    async block => {
      const f = await mount(undefined, { [block]: true });
      await act(async () => auth.setSessionFromTokenResponse(response));
      await f.notify("focus");
      expect(auth.isAuthenticated).toBe(true);
      await act(async () => auth.logout());
      await f.notify("pageshow");
      expect(auth.isAuthenticated).toBe(false);
    }
  );

  it("does not revive a shared token after logging out while storage is blocked", async () => {
    const f = await mount(undefined, { blockAll: true });
    await act(async () => auth.setSessionFromTokenResponse(response));
    await act(async () => auth.logout());
    f.legacy.set(key, JSON.stringify({ ...response, backend: AUTH_BACKEND }));
    Object.assign(f.window, {
      localStorage: f.storage(f.legacy),
      sessionStorage: f.storage(f.tab),
    });
    await f.notify("focus");
    expect(auth.isAuthenticated).toBe(false);
    expect(f.legacy.get(key)).toBe("null");
  });

  it("retains a newer tab login across a remount when shared writes are blocked", async () => {
    const shared = new Map([
      [key, JSON.stringify({ ...response, backend: AUTH_BACKEND })],
    ]);
    const first = await mount(undefined, { shared, readOnlyShared: true });
    await act(async () =>
      auth.setSessionFromTokenResponse({
        ...response,
        access_token: "next-token",
      })
    );
    await first.notify("focus");
    expect(auth.token).toBe("next-token");
    const tab = Object.fromEntries(first.tab);
    await act(async () => first.root.unmount());
    roots.splice(roots.indexOf(first.root), 1);
    await mount(tab, { shared, readOnlyShared: true });
    expect(auth.token).toBe("next-token");
    await act(async () => auth.logout());
    expect(auth.isAuthenticated).toBe(false);
  });
});
