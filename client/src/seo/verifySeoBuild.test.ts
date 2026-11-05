import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseHTML } from "linkedom";
import { collectProductionHomepageErrors, collectSeoBuildErrors } from "../../../scripts/verify-seo-build.mjs";
import { getCanonicalUrl, getSitePage, sitePages } from "./sitePages";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe("SEO build verification", () => {
  it("keeps all migrated route first paints on the same site and shared navigation", () => {
    const outputDir = path.resolve(process.cwd(), "dist/public");
    for (const file of ["index.html", "journal/index.html", "journal/rewind-on-an-older-apple-watch/index.html", "mcp/index.html", "privacy/index.html", "privacy.html", "terms/index.html", "support/index.html", "login.html", "profile.html", "connected-clients.html", "mcp/oauth/consent.html"]) {
      const { document } = parseHTML(fs.readFileSync(path.join(outputDir, file), "utf8"));
      const header = document.querySelector("header.memova-watch-header");
      expect(header, file).toBeTruthy();
      expect(header!.querySelectorAll(".mw-desktop-nav a"), file).toHaveLength(5);
      for (const href of ["/journal/", "/mcp/", "/login"]) {
        const link = header!.querySelector(`a[href="${href}"]`)!;
        expect(link, `${file} ${href}`).toBeTruthy();
        expect(link.getAttribute("target"), `${file} ${href}`).toBeNull();
      }
      expect(header!.querySelector('a[href^="https://memova.ai"]'), file).toBeNull();
      expect(document.querySelector(".five-header, .memova-seo-legal__header"), file).toBeNull();
    }
  });

  it("serves the Blog and Avery’s complete article before JavaScript while excluding retired articles", () => {
    const outputDir = path.resolve(process.cwd(), "dist/public");
    const pages = [
      path.join(outputDir, "journal/index.html"),
      path.join(outputDir, "journal/rewind-on-an-older-apple-watch/index.html"),
    ];
    for (const file of pages) {
      const html = fs.readFileSync(file, "utf8");
      const { document } = parseHTML(html);
      expect(document.querySelector("header.memova-watch-header")).toBeTruthy();
      expect(document.querySelector(".mw-download")?.getAttribute("href")).toBe("https://apps.apple.com/us/app/memova-ai/id6796284954");
      expect(html).toContain('href="/#pro"');
      expect(html).toContain('aria-current="page">Blog');
      expect(html).not.toContain('class="memova-seo-shell__nav"');
      expect(html).not.toContain("Join Early Access");
      expect(html).not.toContain('href="/#use-cases"');
      const stylesheet = html.match(/href="(\/assets\/main-[^"]+\.css)"/)?.[1];
      expect(stylesheet).toBeDefined();
      expect(
        fs.readFileSync(path.join(outputDir, stylesheet!), "utf8")
      ).toContain(".memova-journal-index");
    }
    const index = fs.readFileSync(pages[0], "utf8");
    expect(index).not.toContain("New stories are on the way.");
    expect(index).toContain("Avery · GTM at Memova");
    expect(index).toMatch(
      /href="\/journal\/rewind-on-an-older-apple-watch\/?"/
    );
    expect(index).toContain('src="/journal/avery.jpg"');
    const article = fs.readFileSync(pages[1], "utf8");
    expect(article).toContain(
      "<h1>How to Get Rewind Features on an Older Apple Watch</h1>"
    );
    expect(article).toContain("Coming soon · Memova Pro");
    expect(article).toContain("<strong>Avery</strong>");
    expect(article).toContain("GTM at Memova");
    expect(article).toContain('src="/journal/avery.jpg"');
    expect(article).toContain("Why a Longer Rewind Window Matters");
    expect(article).toContain(
      "Bring your index finger and thumb together twice to open Memova Rewind (coming soon) and revisit what was just said."
    );
    expect(article).toContain(
      "they do not confirm compatibility for the upcoming Rewind feature"
    );
    expect(article).toContain(
      "Local transcription and text search can work offline"
    );
    expect(article).toContain("<summary>Is Memova Rewind available now?");
    expect(article).toContain("Not yet. Rewind is coming soon");
    expect(article).toContain(
      "Does installing Memova enable Apple Live Rewind?"
    );
    expect(article).toContain("Choose How Far Back You Want to Look");
    for (const image of [
      "01-settings",
      "02-window-options",
      "03-double-tap-gesture",
      "04-conversation",
    ]) {
      const src = `/journal/rewind/${image}.webp`;
      expect(article).toContain(`src="${src}"`);
      expect(fs.existsSync(path.join(outputDir, src))).toBe(true);
    }
    expect(article).not.toContain("03-apple-watch-digital-crown-rewind");
    expect(article).not.toMatch(
      /double[\s-]*(?:press|click)\s+(?:the\s+)?side button/i
    );
    expect(article).toContain(
      "<title>Rewind on an Older Apple Watch: Memova’s Upcoming Feature</title>"
    );
    expect(article).toContain(
      'rel="canonical" href="https://memova.ai/journal/rewind-on-an-older-apple-watch"'
    );
    expect(article).toContain('"@type":"Article"');
    expect(article).not.toContain('"datePublished"');
    const sitemap = fs.readFileSync(
      path.join(outputDir, "sitemap.xml"),
      "utf8"
    );
    expect(sitemap).toContain(
      "https://memova.ai/journal/rewind-on-an-older-apple-watch"
    );
    for (const slug of [
      "why-we-changed-our-onboarding-story",
      "the-architecture-of-sleep",
    ]) {
      expect(
        fs.existsSync(path.join(outputDir, `journal/${slug}/index.html`))
      ).toBe(false);
      expect(sitemap).not.toContain(`/journal/${slug}`);
    }
    for (const html of [index, article]) {
      expect(html).not.toContain("Why we changed our onboarding story.");
      expect(html).not.toContain("The Architecture of Sleep.");
    }
  });
  it("publishes indexable article HTML with one authoritative set of SEO metadata", () => {
    const route = "/journal/rewind-on-an-older-apple-watch";
    const page = getSitePage(route);
    const outputDir = path.resolve(process.cwd(), "dist/public");
    const html = fs.readFileSync(
      path.join(outputDir, route, "index.html"),
      "utf8"
    );
    const { document } = parseHTML(html);

    expect(page.index).toBe(true);
    expect(document.querySelectorAll("title")).toHaveLength(1);
    expect(document.title).toBe(page.title);
    expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(
      1
    );
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content")
    ).toBe(page.description);
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ).toBe(getCanonicalUrl(page));
    expect(document.querySelectorAll('meta[name="robots"]')).toHaveLength(1);
    expect(
      document.querySelector('meta[name="robots"]')?.getAttribute("content")
    ).toMatch(/^index, follow(?:,|$)/);
    for (const meta of document.querySelectorAll(
      'meta[name="robots"], meta[name="googlebot"], meta[http-equiv="X-Robots-Tag"]'
    )) {
      expect(meta.getAttribute("content")).not.toMatch(
        /noindex|nofollow|\bnone\b/i
      );
    }

    // The offline handoff is deliberately not a deployment input. This route
    // must not inherit any of the private/demo route header restrictions.
    const headerRules = fs
      .readFileSync(path.join(outputDir, "_headers"), "utf8")
      .trim()
      .split(/\n\s*\n/);
    for (const rule of headerRules) {
      const [pattern, ...headers] = rule.split("\n");
      const regex = new RegExp(
        "^" +
          pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replaceAll("*", ".*") +
          "$"
      );
      if (regex.test(route) || regex.test(route + "/")) {
        expect(headers.join("\n")).not.toMatch(
          /X-Robots-Tag:.*(?:noindex|nofollow|\bnone\b)/i
        );
      }
    }
    const sitemap = fs.readFileSync(
      path.join(outputDir, "sitemap.xml"),
      "utf8"
    );
    expect(sitemap.split(`<loc>${getCanonicalUrl(page)}</loc>`)).toHaveLength(
      2
    );
  });

  it("rejects an incomplete static output", () => {
    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "memova-seo-empty-")
    );
    temporaryDirectories.push(directory);

    const errors = collectSeoBuildErrors(directory, sitePages);

    expect(errors.length).toBeGreaterThan(5);
    expect(errors.some(error => error.includes("robots.txt"))).toBe(true);
    expect(errors.some(error => error.includes("sitemap.xml"))).toBe(true);
  });

  it("accepts the generated production SEO output", () => {
    const output = path.resolve(process.cwd(), "dist/public");
    const homepage = fs.readFileSync(path.join(output, "index.html"), "utf8");

    expect(collectSeoBuildErrors(output, sitePages)).toEqual([]);
    expect(homepage).toContain('data-production-homepage="watch-life-v1"');
    expect(homepage).toContain('data-seo-snapshot="true"');
    expect(homepage).not.toContain('id="manus-runtime"');
    expect(homepage).not.toContain("__MANUS_HOST_DEV__");
  });

  it("rejects a production artifact containing the Manus development runtime", () => {
    const output = path.resolve(process.cwd(), "dist/public");
    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "memova-seo-manus-runtime-")
    );
    temporaryDirectories.push(directory);
    fs.cpSync(output, directory, { recursive: true });
    fs.appendFileSync(
      path.join(directory, "index.html"),
      '<script id="manus-runtime">window.__MANUS_HOST_DEV__ = true;</script>'
    );

    const errors = collectSeoBuildErrors(directory, sitePages);

    expect(errors.some(error => error.includes("Manus preview runtime"))).toBe(
      true
    );
    expect(
      errors.some(error => error.includes("Manus host development runtime"))
    ).toBe(true);
  });

  it("rejects an analytics bootstrap that cannot run as a classic script", () => {
    const output = path.resolve(process.cwd(), "dist/public");
    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "memova-seo-module-only-analytics-")
    );
    temporaryDirectories.push(directory);
    fs.cpSync(output, directory, { recursive: true });
    fs.appendFileSync(
      path.join(directory, "analytics", "ga4-consent.js"),
      "\nexport {};\n"
    );

    const errors = collectSeoBuildErrors(directory, sitePages);

    expect(
      errors.some(error => error.includes("not classic-script compatible"))
    ).toBe(true);
  });

  it("rejects a stale or unstyled legacy public route shell", () => {
    const output = path.resolve(process.cwd(), "dist/public");
    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "memova-seo-stale-shell-")
    );
    temporaryDirectories.push(directory);
    fs.cpSync(output, directory, { recursive: true });
    const shellPath = path.join(directory, "support", "index.html");
    const shell = fs
      .readFileSync(shellPath, "utf8")
      .replace('id="memova-seo-shell-styles"', 'id="removed-shell-styles"')
      .replace('data-seo-shell-version="2"', 'data-seo-shell-version="1"');
    fs.writeFileSync(shellPath, shell);

    const errors = collectSeoBuildErrors(directory, sitePages);

    expect(errors).toContain("/support has no critical SEO shell styles");
    expect(errors).toContain("/support has no current SEO shell version");
  });

  it("rejects a stale homepage marker, missing static chapters and a blank heading", () => {
    const output = path.resolve("dist/public");
    const homepage = fs.readFileSync(path.join(output, "index.html"), "utf8")
      .replace('data-production-homepage="watch-life-v1"', 'data-production-homepage="retired-homepage"')
      .replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/, "<h1></h1>")
      .replace('id="experience"', 'id="removed-experience"');
    const errors = collectProductionHomepageErrors(homepage, sitePages[0], output);
    expect(errors).toContain("/ has no current production homepage marker");
    expect(errors).toContain("/ static homepage does not match its visible page heading");
    expect(errors).toContain("/ is missing static homepage section #experience");
  });

  it("rejects a Chinese document default or stale language in homepage social and structured metadata", () => {
    const output = path.resolve("dist/public");
    const homepage = fs.readFileSync(path.join(output, "index.html"), "utf8")
      .replace(/<html\b[^>]*>/, '<html lang="zh-CN">')
      .replace(/(<meta\b[^>]*property="og:title"[^>]*content=")[^"]+/, '$1旧的中文标题')
      .replace(/"inLanguage":"en-US"/g, '"inLanguage":"zh-CN"');
    const errors = collectProductionHomepageErrors(homepage, sitePages[0], output);
    expect(errors).toContain("/ does not declare the English homepage language");
    expect(errors).toContain("/ does not use the current English homepage social metadata");
    expect(errors).toContain("/ structured data does not describe the current homepage");
  });

  it("rejects a missing homepage entry and local development URLs", () => {
    const output = path.resolve("dist/public");
    const homepage = fs.readFileSync(path.join(output, "index.html"), "utf8")
      .replace(/(<script\b[^>]*type="module"[^>]*src=")[^"]+/, '$1/missing-homepage-entry.js')
      .replace("</body>", '<img src="http://localhost:5173/preview.png"></body>');
    const errors = collectProductionHomepageErrors(homepage, sitePages[0], output);
    expect(errors).toContain("/ references a missing local homepage resource: /missing-homepage-entry.js");
    expect(errors).toContain("/ references a local development server or source entry");
  });

  it("rejects stale homepage structured data and accidental noindex metadata", () => {
    const output = path.resolve("dist/public");
    const homepage = fs.readFileSync(path.join(output, "index.html"), "utf8")
      .replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)[\s\S]*?(<\/script>)/g,
        '$1{"name":"Retired homepage","url":"https://memova.ai/"}$2')
      .replace("</head>", '<meta name="robots" content="noindex, nofollow"></head>')
      .replace(/(<meta\b[^>]*name="robots"[^>]*content=")[^"]+/, '$1noindex, nofollow');
    const errors = collectProductionHomepageErrors(homepage, sitePages[0], output);
    expect(errors).toContain("/ structured data does not describe the current homepage");
    expect(errors).toContain("/ must remain indexable");
  });

  it("rejects a production file at Cloudflare Pages' 25 MiB limit", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "memova-seo-oversized-"));
    temporaryDirectories.push(directory);
    const oversized = path.join(directory, "oversized.mp4");
    fs.writeFileSync(oversized, "");
    fs.truncateSync(oversized, 25 * 1024 * 1024);
    expect(collectSeoBuildErrors(directory, [])).toContain(
      "oversized.mp4 exceeds the Cloudflare Pages file limit of 25 MiB"
    );
  });

  it("requires a top-level noindex 404 document for Cloudflare Pages", () => {
    const output = path.resolve(process.cwd(), "dist/public");
    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "memova-seo-no-404-")
    );
    temporaryDirectories.push(directory);
    fs.cpSync(output, directory, { recursive: true });
    fs.rmSync(path.join(directory, "404.html"), { force: true });

    const errors = collectSeoBuildErrors(directory, sitePages);

    expect(errors.some(error => error.includes("404.html"))).toBe(true);
  });

  it("rejects explicit HTML rewrites that create Cloudflare 308 loops", () => {
    const output = path.resolve(process.cwd(), "dist/public");
    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "memova-seo-looping-redirect-")
    );
    temporaryDirectories.push(directory);
    fs.cpSync(output, directory, { recursive: true });
    fs.appendFileSync(
      path.join(directory, "_redirects"),
      "\n/login /login.html 200\n"
    );

    const errors = collectSeoBuildErrors(directory, sitePages);

    expect(
      errors.some(error => error.includes("loops under Cloudflare clean URLs"))
    ).toBe(true);
  });

  it("requires direct static shells for both legal routes", () => {
    const output = path.resolve(process.cwd(), "dist/public");
    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "memova-seo-no-legal-shells-")
    );
    temporaryDirectories.push(directory);
    fs.cpSync(output, directory, { recursive: true });
    fs.rmSync(path.join(directory, "privacy-policy.html"), { force: true });
    fs.rmSync(path.join(directory, "privacy.html"), { force: true });

    const errors = collectSeoBuildErrors(directory, sitePages);

    expect(errors).toContain(
      "Missing static legal route shell: /privacy-policy"
    );
    expect(errors).toContain("Missing static legal route shell: /privacy");
  });

  it("requires a neutral shell for every private SPA route", () => {
    const output = path.resolve(process.cwd(), "dist/public");
    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "memova-seo-no-private-shell-")
    );
    temporaryDirectories.push(directory);
    fs.cpSync(output, directory, { recursive: true });
    fs.rmSync(path.join(directory, "login.html"), { force: true });

    const errors = collectSeoBuildErrors(directory, sitePages);

    expect(errors).toContain("Missing private SPA route shell: /login");
  });
});
