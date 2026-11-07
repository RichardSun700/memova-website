import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parseHTML } from "linkedom";
import { afterEach, expect, it, vi } from "vitest";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { resolveSiteUrl } from "./siteLinks";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ isAuthenticated: false }),
}));
vi.mock("@/seo/legalLanguage", () => ({
  useLegalLanguage: () => "zh",
  setLegalLanguage: vi.fn(),
  withLegalLanguage: (path: string) => `${path}?lang=zh`,
}));
afterEach(() => vi.unstubAllEnvs());

it("routes public links to the main site while keeping consent/account flows on the dedicated host", () => {
  vi.stubEnv("VITE_MCP_ENVIRONMENT", "production");
  vi.stubEnv("VITE_API_BASE_URL", "https://api.memova.ai");
  vi.stubEnv("VITE_MCP_SERVER_URL", "https://api.memova.ai/v2/mcp");
  const document = parseHTML(
    renderToStaticMarkup(
      createElement(
        "div",
        null,
        createElement(SiteHeader),
        createElement(SiteFooter)
      )
    )
  ).document;
  expect(
    document.querySelector(".mw-desktop-nav a")?.getAttribute("href")
  ).toBe("https://memova.ai/?lang=zh#experience");
  expect(document.querySelector(".mw-signin")?.getAttribute("href")).toBe(
    "/login?lang=zh"
  );
  for (const path of ["/support", "/privacy", "/terms"]) {
    expect(
      document.querySelector(
        `footer a[href="https://memova.ai${path}?lang=zh"]`
      )
    ).not.toBeNull();
  }
  expect(
    document
      .querySelector('img[alt="Memova Discord QR code"]')
      ?.getAttribute("src")
  ).toBe("https://memova.ai/community/discord-community-qr-e9u5ffvhdu.png");
  for (const path of [
    "/login",
    "/mcp/oauth/consent",
    "/mcp/setup",
    "/profile",
    "/connected-clients",
  ]) {
    expect(resolveSiteUrl(`${path}?lang=zh`)).toBe(`${path}?lang=zh`);
  }
  expect(resolveSiteUrl("mailto:hello@memova.ai")).toBe(
    "mailto:hello@memova.ai"
  );
});

it("preserves general-site navigation and applies the same partial-host policy to isolated tests", () => {
  vi.stubEnv("VITE_MCP_ENVIRONMENT", "");
  expect(resolveSiteUrl("/privacy?lang=zh")).toBe("/privacy?lang=zh");
  vi.stubEnv("VITE_MCP_ENVIRONMENT", "isolated-test");
  expect(resolveSiteUrl("/journal/?lang=en#latest")).toBe(
    "https://memova.ai/journal/?lang=en#latest"
  );
  expect(resolveSiteUrl("/mcp/setup?lang=en")).toBe("/mcp/setup?lang=en");
});
