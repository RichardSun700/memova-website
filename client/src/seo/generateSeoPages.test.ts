import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  renderPageHtml,
  renderRobots,
  renderSitemap,
  writeLegalSpaShells,
} from "../../../scripts/generate-seo-pages.mjs";
import { sitePages } from "./sitePages";

const template = `<!doctype html>
<html lang="en"><head><title>Old title</title></head><body><div id="root"></div><script type="module" src="/assets/app.js"></script></body></html>`;

function listHtmlFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listHtmlFiles(entryPath) : entryPath.endsWith(".html") ? [entryPath] : [];
  });
}

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

  it("generates direct static shells for legal SPA routes", () => {
    const directory = fs.mkdtempSync(path.join(process.cwd(), ".tmp-legal-routes-"));
    try {
      writeLegalSpaShells(template, directory);

      const aliasHtml = fs.readFileSync(path.join(directory, "privacy-policy.html"), "utf8");
      const privacyHtml = fs.readFileSync(path.join(directory, "privacy.html"), "utf8");

      expect(aliasHtml).toBe(privacyHtml);
      expect(privacyHtml).toContain("1. Information We Collect");
      expect(privacyHtml).toContain("17. Google Sign-In and Google Workspace Permissions");
      expect(privacyHtml).toContain("Gmail permissions.");
      expect(privacyHtml).toContain("Google Calendar permissions.");
      expect(privacyHtml).toContain("18. Contact Us");
      expect(privacyHtml).toContain('data-seo-snapshot="true"');
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });

  it("does not proxy legal routes through root index.html", () => {
    const redirects = fs.readFileSync(
      path.resolve(process.cwd(), "client/public/_redirects"),
      "utf8",
    );

    expect(redirects).not.toMatch(/^\/privacy-policy \/index\.html 200$/m);
    expect(redirects).not.toMatch(/^\/privacy \/index\.html 200$/m);
  });

  it("uses one shared consent-aware GA4 bootstrap in every source HTML document", () => {
    const projectRoot = path.resolve(process.cwd());
    const htmlFiles = [
      path.join(projectRoot, "client", "index.html"),
      ...listHtmlFiles(path.join(projectRoot, "client", "public")),
    ];

    expect(htmlFiles.length).toBeGreaterThan(10);
    for (const file of htmlFiles) {
      const html = fs.readFileSync(file, "utf8");
      expect(html.match(/\/analytics\/ga4-consent\.js/g), file).toHaveLength(1);
      expect(html, file).not.toContain("googletagmanager.com/gtag/js");
      expect(html, file).not.toContain("gtag('config', 'G-9YJQ994J98')");
    }
  });

  it("sets regional analytics consent before loading GA4 and disables automatic page views", () => {
    const bootstrap = fs.readFileSync(
      path.resolve(process.cwd(), "client/public/analytics/ga4-consent.js"),
      "utf8",
    );

    expect(bootstrap).toContain('const MEASUREMENT_ID = "G-9YJQ994J98"');
    expect(bootstrap).toContain('analytics_storage: "denied"');
    expect(bootstrap).toContain('ad_storage: "denied"');
    expect(bootstrap).toContain('ad_user_data: "denied"');
    expect(bootstrap).toContain('ad_personalization: "denied"');
    expect(bootstrap).toContain("PROTECTED_REGIONS");
    expect(bootstrap).toContain("send_page_view: false");
    expect(bootstrap.indexOf('gtag("consent", "default"')).toBeLessThan(
      bootstrap.indexOf("\n  addGoogleTag();"),
    );
  });

  it("keeps the hidden ODM partnership page reachable without indexing it", () => {
    const publicDirectory = path.resolve(process.cwd(), "client/public");
    const redirects = fs.readFileSync(path.join(publicDirectory, "_redirects"), "utf8");
    const headers = fs.readFileSync(path.join(publicDirectory, "_headers"), "utf8");
    const odmPage = path.join(publicDirectory, "odmpartnership", "index.html");

    expect(fs.existsSync(odmPage)).toBe(true);
    const odmHtml = fs.readFileSync(odmPage, "utf8");
    expect(odmHtml).toContain("Memova × ODM｜公司实力与首个 SKU 合作方案");
    expect(odmHtml).toContain("首轮合作产品：录音卡、夹耳式耳机、智能眼镜");
    expect(odmHtml).toContain("录音卡、夹耳式耳机和智能眼镜工程样机");
    expect(odmHtml).toContain('<h3>录音卡</h3><div class="hardware-price">入门级</div>');
    expect(odmHtml).toContain('<h3>手表扣</h3><div class="hardware-price">主流级</div>');
    expect(odmHtml).toContain('<h3>夹耳式耳机</h3><div class="hardware-price">主流级</div>');
    expect(odmHtml).toContain('<h3>智能眼镜</h3><div class="hardware-price">专业级</div>');
    expect(odmHtml).toContain('<h3>Memova Pen</h3><div class="hardware-price">奢侈品级</div>');
    expect(odmHtml).not.toMatch(/US\$(90|120|150|200|500)/);
    expect(odmHtml.match(/class=\"team-card/g)).toHaveLength(5);
    expect(odmHtml.indexOf("杜天蔚")).toBeLessThan(odmHtml.indexOf("江维力"));
    expect(odmHtml.indexOf("江维力")).toBeLessThan(odmHtml.indexOf("陈晨"));
    expect(redirects).toMatch(/^\/odmpartnership \/odmpartnership\/ 301$/m);
    expect(headers).toContain("/odmpartnership/*\n  X-Robots-Tag: noindex, nofollow");
  });

  it("publishes the hidden Jiang Weili CMO profile at the canonical team path", () => {
    const publicDirectory = path.resolve(process.cwd(), "client/public");
    const redirects = fs.readFileSync(path.join(publicDirectory, "_redirects"), "utf8");
    const headers = fs.readFileSync(path.join(publicDirectory, "_headers"), "utf8");
    const profilePage = path.join(publicDirectory, "team", "weilijiang", "index.html");

    expect(fs.existsSync(profilePage)).toBe(true);
    expect(redirects).toMatch(/^\/team\/weilijiang \/team\/weilijiang\/ 301$/m);
    expect(headers).toContain("/team/weilijiang/*\n  X-Robots-Tag: noindex, nofollow");
  });
});
