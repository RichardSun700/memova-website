import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { renderPageHtml, renderRobots, renderSitemap } from "../../../scripts/generate-seo-pages.mjs";
import { sitePages } from "./sitePages";

const template = `<!doctype html>
<html lang="en"><head><title>Old title</title></head><body><div id="root"></div><script type="module" src="/assets/app.js"></script></body></html>`;

describe("SEO build generator", () => {
  it("injects route metadata, structured data, and visible matching copy", () => {
    const page = sitePages.find((candidate) => candidate.path === "/agent-memory")!;
    const html = renderPageHtml(template, page);

    expect(html).toContain(`<title>${page.title}</title>`);
    expect(html).toContain(`name="description" content="${page.description}`);
    expect(html).toContain(`rel="canonical" href="https://memova.ai/agent-memory"`);
    expect(html).toContain(`property="og:title" content="${page.title}`);
    expect(html).toContain(`type="application/ld+json"`);
    expect(html).toContain(`data-seo-snapshot="true"`);
    expect(html).toContain(page.summary);
    expect(html).not.toContain("Old title");
  });

  it("renders unknown routes as a noindex not-found document", () => {
    const page = sitePages.find((candidate) => candidate.path === "/agent-memory")!;
    const html = renderPageHtml(template, { ...page, path: "/404", index: false });

    expect(html).toContain('name="robots" content="noindex, nofollow"');
    expect(html).toContain('rel="canonical" href="https://memova.ai/404"');
  });

  it("generates valid sitemap entries only for indexable pages", () => {
    const xml = renderSitemap(sitePages);

    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>/);
    expect(xml).toContain("<loc>https://memova.ai/agent-memory</loc>");
    expect(xml).not.toContain("/login</loc>");
  });

  it("allows search crawlers, opts out of training, and protects private routes", () => {
    const robots = renderRobots();

    expect(robots).toContain("User-agent: OAI-SearchBot\nAllow: /");
    expect(robots).toContain("User-agent: PerplexityBot\nAllow: /");
    expect(robots).toContain("User-agent: GPTBot\nDisallow: /");
    expect(robots).toContain("Disallow: /mcp/oauth/");
    expect(robots).toContain("Sitemap: https://memova.ai/sitemap.xml");
  });

  it("does not use a catch-all SPA rewrite", () => {
    const redirects = fs.readFileSync(
      path.resolve(process.cwd(), "client/public/_redirects"),
      "utf8",
    );

    expect(redirects).not.toMatch(/^\/\*\s/m);
  });
});
