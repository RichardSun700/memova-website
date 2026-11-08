import fs from "node:fs";
import path from "node:path";
import { Script } from "node:vm";
import { describe, expect, it, vi } from "vitest";
import {
  renderPageHtml,
  PRIVATE_SPA_PAGES,
} from "../../../scripts/generate-seo-pages.mjs";

describe("authentication page privacy", () => {
  it("does not initialize analytics on account and authorization pages", () => {
    const source = fs.readFileSync(
      path.resolve("client/public/analytics/ga4-consent.js"),
      "utf8"
    );
    for (const pathname of [
      "/login",
      "/mcp/login",
      "/mcp/oauth/consent",
      "/connected-clients",
      "/profile",
      "/settings/connected-clients",
    ]) {
      const appendChild = vi.fn();
      const window = { location: { pathname, search: "?request_id=example" } };
      new Script(source).runInNewContext({
        window,
        document: { head: { appendChild } },
      });
      expect(appendChild).not.toHaveBeenCalled();
      expect("dataLayer" in window).toBe(false);
      expect("memovaAnalytics" in window).toBe(false);
    }
  });

  it("ships private route HTML without analytics or third-party font requests", () => {
    const template =
      '<html><head><script type="module" src="/analytics/ga4-consent.js?v=1"></script><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Example"></head><body><div id="root"></div></body></html>';
    for (const page of PRIVATE_SPA_PAGES) {
      const html = renderPageHtml(template, page);
      expect(html).not.toContain("/analytics/ga4-consent.js");
      expect(html).not.toContain("fonts.googleapis.com");
      expect(html).toContain('name="referrer" content="no-referrer"');
      expect(html).toContain('content="noindex, nofollow"');
    }
  });
});
