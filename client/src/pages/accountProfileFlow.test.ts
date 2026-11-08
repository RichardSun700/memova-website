import fs from "node:fs";
import path from "node:path";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { parseHTML } from "linkedom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SiteHeader from "@/components/SiteHeader";

const auth = vi.hoisted(() => ({
  isAuthenticated: true,
  user: {
    display_name: "Alex",
    email: "private@example.com",
    avatar_url: "/test-avatar.png",
    avatar_version: "v1",
  },
  logout: vi.fn(async () => {}),
  refreshUser: vi.fn(async () => {}),
}));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => auth }));

const roots: Root[] = [];
beforeEach(() => {
  auth.isAuthenticated = true;
  auth.logout.mockReset().mockResolvedValue(undefined);
  auth.refreshUser.mockReset().mockResolvedValue(undefined);
});
afterEach(async () => {
  for (const root of roots.splice(0)) await act(() => root.unmount());
  vi.unstubAllGlobals();
});

async function headerFixture(pathname = "/journal/") {
  const { document, window } = parseHTML('<html lang="en"><head></head><body><div id="root"></div></body></html>');
  const location = Object.assign(new URL(pathname, "https://memova.ai"), { assign: vi.fn() });
  const storage = new Map<string, string>();
  Object.assign(window, {
    location,
    history: { state: null, replaceState: vi.fn() },
    localStorage: {
      getItem: (key: string) => storage.get(key) || null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    },
    matchMedia: vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    requestAnimationFrame: vi.fn(() => 1),
    cancelAnimationFrame: vi.fn(),
    MemovaLanguage: undefined,
  });
  Object.defineProperty(document, "fonts", { value: { ready: Promise.resolve() }, configurable: true });
  vi.stubGlobal("window", window);
  vi.stubGlobal("document", document);
  vi.stubGlobal("localStorage", window.localStorage);
  vi.stubGlobal("CustomEvent", window.CustomEvent);
  vi.stubGlobal("requestAnimationFrame", window.requestAnimationFrame);
  vi.stubGlobal("cancelAnimationFrame", window.cancelAnimationFrame);
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const root = createRoot(document.getElementById("root")!);
  roots.push(root);
  await act(() => root.render(createElement(SiteHeader, { current: "account" })));
  return { document, window, location };
}

async function openAccountMenu(document: Document) {
  const trigger = document.querySelector('button[aria-haspopup="menu"]') as HTMLButtonElement | null;
  expect(trigger).not.toBeNull();
  await act(() => trigger!.click());
  return [...document.querySelectorAll("button")].find(button => button.textContent?.trim() === "Log out")!;
}

const source = (fileName: string) =>
  fs.readFileSync(path.resolve(process.cwd(), "client/src", fileName), "utf8");

describe("account profile completion", () => {
  it("keeps optional profile completion out of the MCP authorization return", () => {
    const login = source("pages/Login.tsx");

    expect(login).toContain("!response.user.display_name?.trim()");
    expect(login.match(/continueAfterVerification\(response\)/g)).toHaveLength(
      2
    );
    expect(login).toContain("What should Memova call you?");
    expect(login).toContain("Continue to Memova");
    expect(login).toContain("disabled={loading || !nickname.trim()}");
    expect(login).toContain(
      "personalize your Memova experience and your Personal Manual"
    );
    expect(login).toContain('placeholder="Your nickname"');
    expect(login).toContain(
      "You can change this anytime and add a profile photo later."
    );
    expect(login).toContain("!auth.user?.display_name?.trim()");
    expect(login).toContain('token_type: "bearer"');
    expect(login).toContain('previewState === "code"');
    expect(login).toContain('if (!mcpLogin && !response.user.display_name?.trim())');
    expect(login).toContain('previewState === "review"');
    expect(login).toContain('previewState === "error"');
  });

  it("persists the nickname and lets the user edit it later", () => {
    const api = source("lib/api.ts");
    const profile = source("pages/Profile.tsx");

    expect(api).toContain('method: "PATCH"');
    expect(api).toContain("body: { display_name: displayName }");
    expect(profile).toContain("Save nickname");
    expect(profile).toContain("updateCurrentUserProfile(");
    expect(profile).toContain("auth.token,");
    expect(profile).toContain(
      "auth.setSessionFromCurrentUserResponse(current)"
    );
  });

  it("uploads and completes an optional avatar using the backend handoff contract", () => {
    const api = source("lib/api.ts");
    const profile = source("pages/Profile.tsx");
    const authContext = source("contexts/AuthContext.tsx");

    expect(api).toContain("avatar_url?: string | null");
    expect(api).toContain("avatar_url_expires_at?: string | null");
    expect(api).toContain("avatar_version?: string | null");
    expect(api).toContain('"/v1/auth/me/avatar-upload"');
    expect(api).toContain("checksum_sha256: checksumSha256");
    expect(api).toContain("headers: upload.headers");
    expect(api).toContain("/complete`");
    expect(api).toContain('"/v1/auth/me/avatar"');
    const blobUpload = api.slice(
      api.indexOf("export async function uploadCurrentUserAvatarBlob"),
      api.indexOf("export async function completeCurrentUserAvatarUpload")
    );
    expect(blobUpload).not.toContain("Authorization");

    expect(profile).toContain('title="Edit profile photo"');
    expect(profile).toContain('id="profile-avatar-upload"');
    expect(profile).toContain('accept="image/png,image/jpeg,image/webp"');
    expect(profile).not.toContain("image/gif");
    expect(profile).toContain("completeCurrentUserAvatarUpload");
    expect(profile).toContain("deleteCurrentUserAvatar");
    expect(profile).toContain("Profile photo saved.");
    expect(profile).toContain("Profile photo editing is not available yet.");
    expect(profile).toContain('auth.workspace?.type === "personal"');
    expect(profile).toContain("`${auth.user.display_name.trim()}'s Workspace`");
    expect(authContext).toContain("sessionWithoutTemporaryAvatarUrl");
    expect(authContext).toContain("avatar_url: null");
  });

  it("shows nickname identity and avatar in the shared authenticated navigation without email", async () => {
    const f = await headerFixture();
    const header = f.document.querySelector("header")!;
    expect(header.textContent).toContain("Alex");
    expect(header.textContent).not.toContain(auth.user.email);
    const avatar = header.querySelector('img[src="/test-avatar.png"]')!;
    expect(avatar).not.toBeNull();
    await act(() => avatar.dispatchEvent(new f.window.Event("error")));
    expect(auth.refreshUser).toHaveBeenCalledOnce();
    const logout = await openAccountMenu(f.document);
    expect(logout).toBeDefined();
    expect(header.querySelector('a[href^="/profile"]')).not.toBeNull();
    await act(() => logout.click());
    expect(auth.logout).toHaveBeenCalledOnce();
  });

  it("keeps sign in available in the shared navigation without an account", async () => {
    auth.isAuthenticated = false;
    const f = await headerFixture();
    const header = f.document.querySelector("header")!;
    expect(header.querySelector('a[href^="/login"]')).not.toBeNull();
    expect(header.textContent).not.toContain(auth.user.email);
    expect(header.querySelector('img[src="/test-avatar.png"]')).toBeNull();
  });

  it.each(["/profile", "/connected-clients", "/settings/connected-clients", "/mcp/oauth/consent"])("returns %s to the clean homepage URL after log out completes", async (path) => {
    const f = await headerFixture(path);
    let finishLogout!: () => void;
    const logoutComplete = new Promise<void>(resolve => { finishLogout = resolve; });
    auth.logout.mockReturnValueOnce(logoutComplete);
    const logout = await openAccountMenu(f.document);
    await act(() => logout.click());
    expect(auth.logout).toHaveBeenCalledOnce();
    expect(f.location.assign).not.toHaveBeenCalled();
    await act(async () => { finishLogout(); await logoutComplete; });
    expect(f.location.assign).toHaveBeenCalledWith("/");
  });

  it("makes MCP approval the clear primary action and returns automatically after success", () => {
    const consent = source("pages/McpConsent.tsx");
    const accountShell = source("components/account/AccountShell.tsx");
    const login = source("pages/Login.tsx");
    const footer = source("components/SiteFooter.tsx");
    const brand = source("components/MemovaBrand.tsx");
    const styles = source("index.css");

    expect(consent).toContain("oauth-approve-button");
    expect(consent).toContain("bg-[#397D5C]");
    expect(consent).toContain("Approving access…");
    expect(consent).toContain("Cancel this connection");
    expect(consent).not.toContain("\n                  Deny\n");
    expect(consent).toContain("Authorization approved");
    expect(consent).toContain("Return to agent");
    expect(consent).toContain("AUTO_REDIRECT_DELAY_MS");
    expect(consent).toContain("window.location.assign(approvalRedirectUri)");
    expect(styles).toContain("@keyframes oauth-approve-pulse");
    expect(styles).toContain("@keyframes oauth-success-pop");
    expect(styles).toContain("prefers-reduced-motion: reduce");
    expect(accountShell).toContain("<SiteHeader ");
    expect(login).toContain('<SiteHeader current={mcpLogin ? "mcp" : "login"} />');
    expect(accountShell).not.toContain("<MemovaBrand");
    expect(login).not.toContain("<MemovaBrand");
    expect(footer).toContain("<MemovaBrand compact />");
    expect(brand).toContain(
      'src="/brand/memova-app-icon-liquid-blue.svg"'
    );
    expect(brand).toContain('src="/brand/memova-wordmark-blue.svg"');
    expect(brand).not.toContain("<span>MEMOVA</span>");
    expect(accountShell).not.toContain("memova_logo_0eb30acc.png");
    expect(consent).toContain('src="/brand/memova-app-icon-liquid-blue.svg"');
    expect(styles).toContain("--memova-ink: #14284b");
    expect(styles).toContain("--memova-electric: #2864f5");
    expect(styles).toContain("--memova-success: #397d5c");
    expect(styles).toContain("--memova-account-primary: #566ce5");
    expect(styles).toContain("--memova-account-deep: #455e93");
    expect(styles).toContain("--memova-account-ink: #111a30");
  });

  it("uses the current homepage palette throughout the complete account flow", () => {
    const accountSources = [
      source("pages/Login.tsx"),
      source("pages/McpConsent.tsx"),
      source("pages/Profile.tsx"),
      source("pages/ConnectedClients.tsx"),
      source("components/account/AccountShell.tsx"),
      source("components/SiteFooter.tsx"),
    ].join("\n");

    expect(accountSources).toContain("#111A30");
    expect(accountSources).toContain("#455E93");
    expect(accountSources).toContain("#566CE5");
    expect(accountSources).toContain("#6B86E8");
    expect(accountSources).toContain("#F6F8FC");
    expect(accountSources).toContain("#FFFEFA");
    expect(accountSources).not.toMatch(
      /#(?:0F2B3C|1A3A5C|2E5B82|2864F5|8E9CC7|FBFCFF)/
    );
  });
});
