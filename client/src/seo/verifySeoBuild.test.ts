import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { collectProductionHomepageErrors, collectSeoBuildErrors } from "../../../scripts/verify-seo-build.mjs";
import { sitePages } from "./sitePages";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe("SEO build verification", () => {
  it("serves the current Journal UI and article content before JavaScript loads", () => {
    const outputDir = path.resolve(process.cwd(), "dist/public");
    const pages = [
      path.join(outputDir, "journal/index.html"),
      path.join(outputDir, "journal/why-we-changed-our-onboarding-story/index.html"),
    ];
    for (const file of pages) {
      const html = fs.readFileSync(file, "utf8");
      expect(html).toContain('class="five-header"');
      expect(html).toContain('class="memova-download-button"');
      expect(html).toContain('href="/pricing/"');
      expect(html).toContain('aria-current="page">Journal');
      expect(html).not.toContain('class="memova-seo-shell__nav"');
      expect(html).not.toContain("Join Early Access");
      expect(html).not.toContain('href="/#use-cases"');
      const stylesheet = html.match(/href="(\/assets\/main-[^"]+\.css)"/)?.[1];
      expect(stylesheet).toBeDefined();
      expect(fs.readFileSync(path.join(outputDir, stylesheet!), "utf8"))
        .toContain(".memova-journal-index");
    }
    expect(fs.readFileSync(pages[0], "utf8"))
      .toContain('aria-label="Filter journal notes"');
    expect(fs.readFileSync(pages[1], "utf8"))
      .toContain("The problem was not a missing tour.");
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
