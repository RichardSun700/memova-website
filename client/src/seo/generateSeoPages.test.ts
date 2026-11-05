import fs from "node:fs";
import path from "node:path";
import { Script } from "node:vm";
import { parseHTML } from "linkedom";
import { describe, expect, it } from "vitest";
import {
  PRIVATE_SPA_PAGES,
  renderPageHtml,
  renderRobots,
  renderSitemap,
  writeLegalSpaShells,
  writePrivateSpaShells,
} from "../../../scripts/generate-seo-pages.mjs";
import { sitePages } from "./sitePages";
import { renderSiteHeaderSnapshot } from "../../../scripts/render-journal-snapshot";

const template = `<!doctype html>
<html lang="en"><head><title>Old title</title></head><body><div id="root"></div><script type="module" src="/assets/app.js"></script></body></html>`;

function listHtmlFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? listHtmlFiles(entryPath)
      : entryPath.endsWith(".html")
        ? [entryPath]
        : [];
  });
}

describe("SEO build generator", () => {
  it.each(["/mcp", "/privacy", "/terms"])("uses the shared site navigation in the %s first paint", route => {
    const page = sitePages.find(candidate => candidate.path === route)!;
    const { document } = parseHTML(renderPageHtml(template, page, {
      headerMarkup: renderSiteHeaderSnapshot(route),
    }));
    const header = document.querySelector("header.memova-watch-header")!;
    expect(document.querySelectorAll("header")).toHaveLength(1);
    expect(document.querySelectorAll(".mw-header-spacer")).toHaveLength(1);
    expect(header.querySelector('a[href="/#experience"]')?.textContent).toBe("Experience Memova");
    expect(header.querySelector('a[href="/#privacy"]')?.textContent).toBe("Privacy & offline");
    expect(header.querySelector('a[href="/#pro"]')?.textContent).toBe("Memova Pro");
    for (const href of ["/journal/", "/mcp/", "/login"]) {
      const link = header.querySelector(`a[href="${href}"]`)!;
      expect(link).toBeTruthy();
      expect(link.getAttribute("target")).toBeNull();
    }
    const internalLinks = [...header.querySelectorAll("a[href]")].filter(link => !link.getAttribute("href")!.startsWith("https://apps.apple.com/"));
    expect(internalLinks.every(link => link.getAttribute("href")!.startsWith("/"))).toBe(true);
    expect(header.querySelector('a[aria-label="Memova home"] img')?.getAttribute("src")).toBe("/brand/memova-app-icon-liquid-blue.svg");
    expect(header.textContent).not.toContain("Living Book");
  });

  it("preserves the shared first paint in clean URL login and policy shells", () => {
    const directory = fs.mkdtempSync(path.join(process.cwd(), ".tmp-site-shells-"));
    try {
      const options = { renderHeader: renderSiteHeaderSnapshot };
      writeLegalSpaShells(template, directory, options);
      writePrivateSpaShells(template, directory, options);
      for (const route of ["privacy", "privacy-policy", "login", "profile", "mcp/oauth/consent"]) {
        const html = fs.readFileSync(path.join(directory, `${route}.html`), "utf8");
        const { document } = parseHTML(html);
        expect(document.querySelectorAll("header.memova-watch-header"), route).toHaveLength(1);
        expect(document.querySelector('header a[href="/journal/"]'), route).toBeTruthy();
        expect(document.querySelector(".memova-seo-shell__nav"), route).toBeNull();
      }
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });

  it.each(["/", "/mcp", "/privacy", "/terms"])("uses the official icon and wordmark in the %s prerendered header", route => {
    const page = sitePages.find(candidate => candidate.path === route)!;
    const { document } = parseHTML(renderPageHtml(template, page));
    const brand = document.querySelector("header a[aria-label='Memova home']")!;

    expect(brand.querySelectorAll("img")).toHaveLength(2);
    expect(brand.querySelector(".memova-seo-brand-icon")?.getAttribute("src")).toBe("/brand/memova-app-icon-liquid-blue.svg");
    expect(brand.querySelector(".memova-seo-brand-wordmark")?.getAttribute("src")).toBe("/brand/memova-wordmark-blue.svg");
    expect(brand.textContent).toBe("");
    expect(document.querySelector("#memova-seo-shell-styles")!.textContent).not.toContain("mix-blend-mode: multiply");
  });

  it("injects route metadata, structured data, and visible matching copy", () => {
    const page = sitePages.find(candidate => candidate.path === "/mcp")!;
    const html = renderPageHtml(template, page);

    expect(html).toContain(`<title>${page.title}</title>`);
    expect(html).toContain(`name="description" content="${page.description}`);
    expect(html).toContain(`rel="canonical" href="https://memova.ai/mcp"`);
    expect(html).toContain(`property="og:title" content="${page.title}`);
    expect(html).toContain(`type="application/ld+json"`);
    expect(html).toContain(`data-seo-snapshot="true"`);
    expect(html).toContain(`data-seo-shell-version="2"`);
    expect(html).toContain(`id="memova-seo-shell-styles"`);
    expect(html).toContain(`class="memova-seo-shell memova-seo-shell--page"`);
    expect(html).toContain(page.summary);
    expect(html).toContain(page.hero!.title);
    expect(html.indexOf(page.hero!.title)).toBeLessThan(
      html.indexOf(`<h2>${page.title}</h2>`)
    );
    expect(html).not.toContain('<main data-seo-snapshot="true"><article>');
    expect(html.indexOf('id="memova-seo-shell-styles"')).toBeLessThan(
      html.indexOf("<body>")
    );
    expect(html).not.toContain("Old title");
  });

  it("renders the homepage as a styled brand shell before React starts", () => {
    const page = sitePages.find(candidate => candidate.path === "/")!;
    const html = renderPageHtml(template, page);

    expect(html).toContain('class="memova-seo-shell"');
    expect(html).toContain(page.hero!.title);
    expect(html).toContain(page.hero!.eyebrow);
    expect(html).toContain("Living Book");
    expect(html).toContain("Download the app");
    expect(html).toContain('href="https://apps.apple.com/us/app/memova-ai/id6796284954"');
    expect(html).toContain('href="/product-journal"');
    expect(html).toContain("Open Product Journal");
    expect(html).not.toContain('href="#product-tour"');
    expect(html).toContain(page.title);
    expect(html).toContain(page.summary);
    expect(html.match(/id="memova-seo-shell-styles"/g)).toHaveLength(1);
  });

  it("renders a crawlable static shell for the standalone Product Journal", () => {
    const page = sitePages.find(
      candidate => candidate.path === "/product-journal"
    )!;
    const html = renderPageHtml(template, page);

    expect(html).toContain('name="robots" content="index, follow');
    expect(html).toContain(
      'rel="canonical" href="https://memova.ai/product-journal"'
    );
    expect(html).toContain("memova-seo-shell--page");
    expect(html).toContain(page.hero!.title);
    expect(html).toContain(page.summary);
    expect(html).not.toContain("Page Not Found");
  });

  it("replaces an existing managed shell style instead of duplicating it", () => {
    const page = sitePages.find(candidate => candidate.path === "/")!;
    const firstPass = renderPageHtml(template, page);
    const secondPassTemplate = firstPass.replace(
      /<div id="root">[\s\S]*?<\/body>/,
      '<div id="root"></div></body>'
    );
    const html = renderPageHtml(secondPassTemplate, page);

    expect(html.match(/id="memova-seo-shell-styles"/g)).toHaveLength(1);
  });

  it("renders unknown routes as a noindex not-found document", () => {
    const page = sitePages.find(candidate => candidate.path === "/mcp")!;
    const html = renderPageHtml(template, {
      ...page,
      path: "/404",
      index: false,
    });

    expect(html).toContain('name="robots" content="noindex, nofollow"');
    expect(html).toContain('rel="canonical" href="https://memova.ai/404"');
    expect(html).toContain("Page Not Found");
    expect(html).not.toContain("Your context,<span>finally understood.</span>");
  });

  it("generates valid sitemap entries only for indexable pages", () => {
    const xml = renderSitemap(sitePages);

    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>/);
    expect(xml).toContain("<loc>https://memova.ai/mcp</loc>");
    expect(xml).toContain("<loc>https://memova.ai/support</loc>");
    expect(xml).toContain("<loc>https://memova.ai/journal</loc>");
    expect(xml).toContain("<loc>https://memova.ai/product-journal</loc>");
    expect(xml).not.toContain("/agent-memory</loc>");
    expect(xml).not.toContain("/ios</loc>");
    expect(xml).not.toContain("/how-it-works</loc>");
    expect(xml).not.toContain("/user-cases</loc>");
    expect(xml).not.toContain("/use-cases/");
    expect(xml).not.toContain("/login</loc>");
    expect(xml).not.toContain("/motion-lab</loc>");
    expect(xml).not.toContain("/framework-preview</loc>");
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
      "utf8"
    );

    expect(redirects).not.toMatch(/^\/\*\s/m);
  });

  it("prevents the private login shell from being reused as the homepage", () => {
    const headers = fs.readFileSync(
      path.resolve(process.cwd(), "client/public/_headers"),
      "utf8"
    );

    expect(headers).toContain(
      "/login\n  X-Robots-Tag: noindex, nofollow\n  Cache-Control: no-store, max-age=0"
    );
  });

  it("generates direct static shells for legal SPA routes", () => {
    const directory = fs.mkdtempSync(
      path.join(process.cwd(), ".tmp-legal-routes-")
    );
    try {
      writeLegalSpaShells(template, directory);

      const aliasHtml = fs.readFileSync(
        path.join(directory, "privacy-policy.html"),
        "utf8"
      );
      const privacyHtml = fs.readFileSync(
        path.join(directory, "privacy.html"),
        "utf8"
      );

      expect(aliasHtml).toBe(privacyHtml);
      expect(privacyHtml).toContain("1. Categories of Information Collected");
      expect(privacyHtml).toContain(
        "17. Third-Party Sign-In and Connected Services"
      );
      expect(privacyHtml).toContain("Gmail permissions.");
      expect(privacyHtml).toContain("Google Calendar permissions.");
      expect(privacyHtml).toContain("20. Contact Information");
      expect(privacyHtml).toContain('data-seo-snapshot="true"');
      expect(privacyHtml).toContain('data-seo-shell-version="2"');
      expect(privacyHtml).toContain('id="memova-seo-shell-styles"');
      expect(privacyHtml).toContain(
        'class="memova-seo-shell memova-seo-shell--legal"'
      );
      expect(privacyHtml).toContain('class="memova-seo-legal__article"');
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });

  it("renders the complete terms document with critical legal styles", () => {
    const page = sitePages.find(candidate => candidate.path === "/terms")!;
    const html = renderPageHtml(template, page);

    expect(html).toContain("Terms of Service");
    expect(html).toContain("1. The Service");
    expect(html).toContain('class="memova-seo-shell memova-seo-shell--legal"');
    expect(html).toContain(
      '<a class="memova-seo-legal__tab" href="/terms" aria-current="page">'
    );
  });

  it.each([
    ["/privacy", "隐私协议", "20. 联系方式", "20. Contact Information"],
    ["/terms", "服务条款", "21. 联系我们", "21. Contact Us"],
  ])("publishes complete authored bilingual content at %s", (route, title, lastZh, lastEn) => {
    const page = sitePages.find(candidate => candidate.path === route)!;
    const html = renderPageHtml(template, page);
    const { document } = parseHTML(html);
    const english = document.querySelector('article[lang="en"]')!;
    const chinese = document.querySelector('article[lang="zh-CN"]')!;
    expect(english.querySelector("h1")!.nextElementSibling?.textContent).toBe("Last updated: November 5, 2026");
    expect(chinese.querySelector("h1")!.nextElementSibling?.textContent).toBe(
      `${route === "/privacy" ? "更新日期" : "最后更新"}：2026年11月5日`
    );
    expect(chinese.querySelector("h1")?.textContent).toBe(title);
    expect(english.textContent).toContain(lastEn);
    expect(chinese.textContent).toContain(lastZh);
    expect(english.textContent).toContain("Microsoft Azure");
    expect(chinese.textContent).toContain("微软 Azure 云平台");
    expect(english.textContent).not.toMatch(/\*\*|\]\(https?:/);
    expect(chinese.textContent).not.toMatch(/待确认|待补充|草案版/);
    for (const article of [english, chinese]) {
      expect(article.textContent).not.toMatch(/预览修订稿|尚未上线|尚未生效|(?:review|preview) revision|not (?:yet )?(?:published|effective)/i);
      if (route === "/privacy") {
        const text = article.textContent!;
        const zh = article === chinese;
        const signInCopy = zh ? [
          "17. 第三方登录与已连接服务", "Apple 登录。", "Microsoft 登录。", "隐藏邮件地址",
          "使用上述登录方式本身不构成对这些内容的访问授权",
          "谷歌邮箱权限。", "谷歌日历权限。", "有限使用要求",
        ] : [
          "17. Third-Party Sign-In and Connected Services", "Sign in with Apple.", "Microsoft sign-in.", "Hide My Email",
          "Using one of these sign-in methods does not itself authorize access to that content",
          "Gmail permissions.", "Google Calendar permissions.", "Limited Use requirements",
        ];
        for (const copy of signInCopy) expect(text).toContain(copy);
        expect(text).toContain(zh ? "原始录音在设备本地转写成文字" : "Recording and transcription take place on your device");
        expect(text).toContain(zh ? "云端仅处理您选择并授权的转写文字" : "limited to transcript text and textual context you authorize");
        expect(text).toContain(zh ? "保存期限最长不超过30天" : "retained for no more than 30 days");
        expect(text).toContain(zh ? "删除一条转写，不会自动删除现有笔记、摘要" : "Deleting a transcript does not automatically delete existing notes, summaries");
        const services = Array.from(article.querySelectorAll("ul")).find(list => list.textContent?.includes("Azure Blob"));
        expect(services).toBeTruthy();
        expect(services!.querySelectorAll("li")).toHaveLength(12);
        expect(services!.textContent).not.toMatch(/Azure AI Speech|云端语音服务/);
        expect(text).not.toContain("|");
      }
    }
  });

  it("selects Chinese before React, keeps legal links in that language and switches back", () => {
    const page = sitePages.find(candidate => candidate.path === "/privacy")!;
    const { document, window } = parseHTML(renderPageHtml(template, page));
    const location = { href: "https://memova.ai/privacy?lang=zh", origin: "https://memova.ai" };
    const script = document.querySelector("#memova-legal-language")!.textContent!;
    new Script(script).runInNewContext({
      document, window, location, URL,
      localStorage: { getItem: () => "en" },
    });
    document.dispatchEvent(new window.Event("DOMContentLoaded"));
    expect(document.documentElement.lang).toBe("zh-CN");
    expect(document.title).toBe("隐私协议 — Memova");
    expect(document.documentElement.dataset.legalLanguage).toBe("zh");
    expect(document.querySelector('.memova-seo-legal__tab')?.getAttribute("href")).toBe("/privacy?lang=zh");
    window.dispatchEvent(new window.CustomEvent("memova:languagechange", { detail: { language: "en" } }));
    expect(document.title).toBe("Privacy Policy — Memova");
    expect(document.documentElement.lang).toBe("en-US");
    expect(document.documentElement.dataset.legalLanguage).toBe("en");
    expect(document.querySelector('.memova-seo-legal__tab')?.getAttribute("href")).toBe("/privacy?lang=en");
  });

  it("generates neutral noindex shells for every private SPA route", () => {
    const directory = fs.mkdtempSync(
      path.join(process.cwd(), ".tmp-private-routes-")
    );
    try {
      writePrivateSpaShells(template, directory);

      for (const page of PRIVATE_SPA_PAGES) {
        const destination = path.join(
          directory,
          `${page.path.replace(/^\//, "")}.html`
        );
        const html = fs.readFileSync(destination, "utf8");

        expect(html, page.path).toContain(
          'name="robots" content="noindex, nofollow"'
        );
        expect(html, page.path).toContain("memova-seo-app__card");
        expect(html, page.path).toContain(page.hero.title);
        expect(html, page.path).not.toContain(
          "Your context,<span>finally understood."
        );
      }
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });

  it("serves legal routes through Cloudflare clean URLs without rewrites", () => {
    const redirects = fs.readFileSync(
      path.resolve(process.cwd(), "client/public/_redirects"),
      "utf8"
    );

    expect(redirects).not.toMatch(/^\/privacy-policy \/index\.html 200$/m);
    expect(redirects).not.toMatch(/^\/privacy \/index\.html 200$/m);
    expect(redirects).not.toMatch(
      /^\/privacy-policy \/privacy-policy\.html 200$/m
    );
  });

  it("avoids HTML rewrites that loop under Cloudflare clean URLs", () => {
    const redirects = fs.readFileSync(
      path.resolve(process.cwd(), "client/public/_redirects"),
      "utf8"
    );

    for (const page of PRIVATE_SPA_PAGES) {
      const expected = `${page.path} ${page.path}.html 200`;
      expect(redirects, page.path).not.toContain(expected);
      expect(redirects, page.path).not.toContain(
        `${page.path} /index.html 200`
      );
    }
    expect(redirects).not.toContain("/404 /404.html 200");
    expect(redirects).not.toContain("/404 /index.html 200");
  });

  it("keeps the Avery direct-link page noindex on custom domains", () => {
    const headers = fs.readFileSync(
      path.resolve(process.cwd(), "client/public/_headers"),
      "utf8"
    );

    expect(headers).toContain(
      "/avery-portfolio-book/*\n  X-Robots-Tag: noindex, nofollow"
    );
  });

  it("uses extension route shells and the real 404 in the local production server", () => {
    const server = fs.readFileSync(
      path.resolve(process.cwd(), "server/index.ts"),
      "utf8"
    );

    expect(server).toContain(
      'express.static(staticPath, { extensions: ["html"] })'
    );
    expect(server).toContain(
      'res.status(404).sendFile(path.join(staticPath, "404.html"))'
    );
    expect(server).not.toContain(
      'res.sendFile(path.join(staticPath, "index.html"))'
    );
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
      "utf8"
    );

    expect(bootstrap).toContain('const MEASUREMENT_ID = "G-9YJQ994J98"');
    expect(bootstrap).toContain('analytics_storage: "denied"');
    expect(bootstrap).toContain('ad_storage: "denied"');
    expect(bootstrap).toContain('ad_user_data: "denied"');
    expect(bootstrap).toContain('ad_personalization: "denied"');
    expect(bootstrap).toContain("PROTECTED_REGIONS");
    expect(bootstrap).toContain("send_page_view: false");
    expect(bootstrap.indexOf('gtag("consent", "default"')).toBeLessThan(
      bootstrap.indexOf("\n  scheduleGoogleTag();")
    );
  });

  it("keeps the shared analytics bootstrap valid for classic and module loaders", () => {
    const bootstrap = fs.readFileSync(
      path.resolve(process.cwd(), "client/public/analytics/ga4-consent.js"),
      "utf8"
    );

    expect(() => new Script(bootstrap)).not.toThrow();
    expect(bootstrap).not.toMatch(/^\s*(?:import|export)\b/m);
    expect(bootstrap).not.toContain("chapter01-mobile-motion-fix");
    expect(bootstrap).toContain(
      'script[data-spa="true"][src^="/analytics/ga4-consent.js"]'
    );
  });

  it("keeps the hidden ODM partnership page reachable without indexing it", () => {
    const publicDirectory = path.resolve(process.cwd(), "client/public");
    const redirects = fs.readFileSync(
      path.join(publicDirectory, "_redirects"),
      "utf8"
    );
    const headers = fs.readFileSync(
      path.join(publicDirectory, "_headers"),
      "utf8"
    );
    const odmPage = path.join(publicDirectory, "odmpartnership", "index.html");

    expect(fs.existsSync(odmPage)).toBe(true);
    const odmHtml = fs.readFileSync(odmPage, "utf8");
    expect(odmHtml).toContain("Memova × ODM｜公司实力与首个 SKU 合作方案");
    expect(odmHtml).toContain("首轮合作产品：录音卡、夹耳式耳机、智能眼镜");
    expect(odmHtml).toContain("录音卡、夹耳式耳机和智能眼镜工程样机");
    expect(odmHtml).toContain(
      '<h3>录音卡</h3><div class="hardware-price">入门级</div>'
    );
    expect(odmHtml).toContain(
      '<h3>手表扣</h3><div class="hardware-price">主流级</div>'
    );
    expect(odmHtml).toContain(
      '<h3>夹耳式耳机</h3><div class="hardware-price">主流级</div>'
    );
    expect(odmHtml).toContain(
      '<h3>智能眼镜</h3><div class="hardware-price">专业级</div>'
    );
    expect(odmHtml).toContain(
      '<h3>Memova Pen</h3><div class="hardware-price">奢侈品级</div>'
    );
    expect(odmHtml).not.toMatch(/US\$(90|120|150|200|500)/);
    expect(odmHtml.match(/class=\"team-card/g)).toHaveLength(5);
    expect(odmHtml.indexOf("杜天蔚")).toBeLessThan(odmHtml.indexOf("江维力"));
    expect(odmHtml.indexOf("江维力")).toBeLessThan(odmHtml.indexOf("陈晨"));
    expect(redirects).toMatch(/^\/odmpartnership \/odmpartnership\/ 301$/m);
    expect(headers).toContain(
      "/odmpartnership/*\n  X-Robots-Tag: noindex, nofollow"
    );
  });

  it("publishes the hidden Jiang Weili CMO profile at the canonical team path", () => {
    const publicDirectory = path.resolve(process.cwd(), "client/public");
    const redirects = fs.readFileSync(
      path.join(publicDirectory, "_redirects"),
      "utf8"
    );
    const headers = fs.readFileSync(
      path.join(publicDirectory, "_headers"),
      "utf8"
    );
    const profilePage = path.join(
      publicDirectory,
      "team",
      "weilijiang",
      "index.html"
    );

    expect(fs.existsSync(profilePage)).toBe(true);
    expect(redirects).toMatch(/^\/team\/weilijiang \/team\/weilijiang\/ 301$/m);
    expect(headers).toContain(
      "/team/weilijiang/*\n  X-Robots-Tag: noindex, nofollow"
    );
  });
});
