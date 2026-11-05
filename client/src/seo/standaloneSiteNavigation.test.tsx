import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parseHTML } from "linkedom";
import { describe, expect, it } from "vitest";
import WatchSiteHeader, { type WatchSiteHeaderProps } from "@shared/site/WatchSiteHeader";

const previewUrl = "http://localhost:4173/mcp/";

function renderHeader(props: WatchSiteHeaderProps = {}) {
  return parseHTML(renderToStaticMarkup(createElement(WatchSiteHeader, props))).document;
}

function hrefs(root: ParentNode) {
  return Array.from(root.querySelectorAll("a"), link => link.getAttribute("href"));
}

describe("standalone site navigation", () => {
  it.each([
    { name: "default homepage", props: { home: true, current: "privacy" }, chapters: ["#experience", "#privacy", "#pro"], brand: "#top", journal: "/journal/", mcp: "/mcp/", login: "/login", current: "location" },
    { name: "Chinese homepage", props: { home: true, language: "zh", current: "privacy" }, chapters: ["#experience", "#privacy", "#pro"], brand: "#top", journal: "/journal/?lang=zh", mcp: "/mcp/?lang=zh", login: "/login?lang=zh", current: "location" },
    { name: "default interior", props: { current: "mcp" }, chapters: ["/#experience", "/#privacy", "/#pro"], brand: "/", journal: "/journal/", mcp: "/mcp/", login: "/login", current: "page" },
    { name: "Chinese interior", props: { language: "zh", current: "mcp" }, chapters: ["/?lang=zh#experience", "/?lang=zh#privacy", "/?lang=zh#pro"], brand: "/?lang=zh", journal: "/journal/?lang=zh", mcp: "/mcp/?lang=zh", login: "/login?lang=zh", current: "page" },
  ] as const)("keeps $name navigation local and consistent on desktop and mobile", ({ props, chapters, brand, journal, mcp, login, current }) => {
    const document = renderHeader(props);
    const desktop = document.querySelector(".mw-desktop-nav")!;
    const mobile = document.querySelector(".mw-mobile-nav")!;
    const expected = [...chapters, journal, mcp];
    expect(hrefs(desktop)).toEqual(expected);
    expect(hrefs(mobile).slice(0, 5)).toEqual(expected);
    expect(document.querySelector(".mw-brand")?.getAttribute("href")).toBe(brand);
    expect(Array.from(document.querySelectorAll(".mw-signin"), link => link.getAttribute("href"))).toEqual([login, login]);

    for (const navigation of [desktop, mobile]) {
      const active = navigation.querySelectorAll("[aria-current]");
      expect(active).toHaveLength(1);
      expect(active[0].getAttribute("aria-current")).toBe(current);
      expect(active[0].getAttribute("href")).toBe(props.current === "privacy" ? chapters[1] : mcp);
    }

    const internalLinks = Array.from(document.querySelectorAll("a")).filter(link =>
      new URL(link.getAttribute("href")!, previewUrl).origin === new URL(previewUrl).origin
    );
    expect(internalLinks).toHaveLength(13);
    for (const link of internalLinks) {
      const href = link.getAttribute("href")!;
      expect(href.startsWith("/") || href.startsWith("#")).toBe(true);
      expect(href.startsWith("//")).toBe(false);
      expect(link.hasAttribute("target")).toBe(false);
      expect(link.querySelector("svg")).toBeNull();
      expect(new URL(href, "http://localhost:5173/profile").origin).toBe("http://localhost:5173");
    }
  });

  it("shows the watch chapters and localized labels without the legacy marketing menu", () => {
    const english = renderHeader();
    const chinese = renderHeader({ language: "zh" });
    expect(english.querySelector(".mw-desktop-nav")?.textContent).toBe("Experience MemovaPrivacy & offlineMemova ProBlogMCP");
    expect(chinese.querySelector(".mw-desktop-nav")?.textContent).toBe("体验 Memova隐私与离线Memova Pro博客MCP");
    for (const document of [english, chinese]) {
      expect(document.querySelector("[aria-current]")).toBeNull();
      expect(document.querySelector("header")?.textContent).not.toMatch(/How It Works|Agent Memory|Use Cases|Work Style|Product demo|Pricing/);
      expect(hrefs(document).some(href => /#(?:act|capture|product|book|use-cases)$/.test(href || ""))).toBe(false);
    }
  });

  it("keeps assets local while retaining deliberate App Store and community exits", () => {
    const document = renderHeader();
    for (const image of Array.from(document.querySelectorAll("img"))) {
      const src = image.getAttribute("src")!;
      expect(src.startsWith("/") && !src.startsWith("//")).toBe(true);
      expect(fs.existsSync(path.resolve(import.meta.dirname, "../../public", `.${src}`))).toBe(true);
    }
    const externalLinks = Array.from(document.querySelectorAll("a")).filter(link =>
      new URL(link.getAttribute("href")!, previewUrl).origin !== new URL(previewUrl).origin
    );
    expect(externalLinks.map(link => link.getAttribute("href"))).toEqual([
      "https://apps.apple.com/us/app/memova-ai/id6796284954",
      "https://apps.apple.com/us/app/memova-ai/id6796284954",
      "https://discord.gg/E9u5FFvhdu",
      "https://discord.gg/E9u5FFvhdu",
    ]);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
    }
  });

  it("renders a dedicated mobile account slot and falls back to the shared account slot", () => {
    const account = createElement("a", { href: "/profile" }, "Desktop account");
    const mobileAccount = createElement("a", { href: "/connected-clients" }, "Mobile account");
    const custom = renderHeader({ account, mobileAccount });
    expect(custom.querySelector(".mw-desktop-account")?.textContent).toBe("Desktop account");
    expect(custom.querySelector('.mw-mobile-nav a[href="/connected-clients"]')?.textContent).toBe("Mobile account");
    expect(custom.querySelector(".mw-mobile-nav")?.textContent).not.toContain("Desktop account");
    expect(custom.querySelector(".mw-signin")).toBeNull();

    const fallback = renderHeader({ account });
    expect(fallback.querySelector('.mw-mobile-nav a[href="/profile"]')?.textContent).toBe("Desktop account");
    expect(fallback.querySelector(".mw-signin")).toBeNull();
  });
});
