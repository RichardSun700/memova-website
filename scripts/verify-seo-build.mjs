import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { SITE_URL, getCanonicalUrl, sitePages } from "../client/src/seo/sitePages.ts";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readIfPresent(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

function pageOutputPath(outputDir, routePath) {
  return routePath === "/"
    ? path.join(outputDir, "index.html")
    : path.join(outputDir, routePath.replace(/^\//, ""), "index.html");
}

export function collectSeoBuildErrors(outputDir, pages) {
  const errors = [];
  const titles = new Map();
  const robotsPath = path.join(outputDir, "robots.txt");
  const sitemapPath = path.join(outputDir, "sitemap.xml");
  const notFoundPath = path.join(outputDir, "404.html");
  const redirectsPath = path.join(outputDir, "_redirects");
  const headersPath = path.join(outputDir, "_headers");
  const robots = readIfPresent(robotsPath);
  const sitemap = readIfPresent(sitemapPath);
  const notFound = readIfPresent(notFoundPath);
  const redirects = readIfPresent(redirectsPath);
  const headers = readIfPresent(headersPath);

  for (const legalRoute of ["/privacy-policy", "/privacy"]) {
    const legalShellPath = path.join(
      outputDir,
      `${legalRoute.replace(/^\//, "")}.html`,
    );
    const legalShell = readIfPresent(legalShellPath);
    if (!legalShell) {
      errors.push(`Missing static legal route shell: ${legalRoute}`);
    } else if (!legalShell.includes("17. Google Sign-In and Google Workspace Permissions")) {
      errors.push(`Static legal route shell requires JavaScript: ${legalRoute}`);
    }
  }

  if (!robots) errors.push("Missing robots.txt");
  if (!sitemap) errors.push("Missing sitemap.xml");
  if (!notFound) errors.push("Missing top-level 404.html required for real Cloudflare Pages 404 responses");
  if (!redirects) errors.push("Missing _redirects");
  if (!headers) errors.push("Missing _headers");

  if (robots) {
    for (const required of ["OAI-SearchBot", "PerplexityBot", "GPTBot", `${SITE_URL}/sitemap.xml`]) {
      if (!robots.includes(required)) errors.push(`robots.txt is missing ${required}`);
    }
  }

  if (redirects && /^\/\*\s/m.test(redirects)) {
    errors.push("_redirects contains a catch-all SPA rewrite that creates soft 404 responses");
  }

  if (notFound && !notFound.includes('name="robots" content="noindex, nofollow"')) {
    errors.push("404.html must be noindex, nofollow");
  }

  if (headers) {
    for (const privatePath of ["/login", "/mcp/oauth/*", "/bay-area-agent-demo-2", "/user-cases/demos/*"]) {
      if (!headers.includes(privatePath)) errors.push(`_headers is missing noindex coverage for ${privatePath}`);
    }
  }

  for (const page of pages.filter((candidate) => candidate.index)) {
    const filePath = pageOutputPath(outputDir, page.path);
    const html = readIfPresent(filePath);
    if (!html) {
      errors.push(`Missing static HTML for ${page.path}: ${filePath}`);
      continue;
    }

    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
    if (!title) {
      errors.push(`${page.path} has no title`);
    } else if (titles.has(title)) {
      errors.push(`${page.path} duplicates the title used by ${titles.get(title)}`);
    } else {
      titles.set(title, page.path);
    }

    const canonical = getCanonicalUrl(page);
    if (!html.includes(`rel="canonical" href="${canonical}"`)) {
      errors.push(`${page.path} does not use its expected canonical ${canonical}`);
    }
    if (!html.includes("data-seo-snapshot=\"true\"")) {
      errors.push(`${page.path} has no static visible SEO snapshot`);
    }
    if (!html.includes(page.summary)) {
      errors.push(`${page.path} static snapshot does not match the route summary`);
    }
    if (!html.includes('type="application/ld+json"')) {
      errors.push(`${page.path} has no JSON-LD structured data`);
    }
    if (sitemap && !sitemap.includes(`<loc>${canonical}</loc>`)) {
      errors.push(`sitemap.xml is missing ${canonical}`);
    }
  }

  if (sitemap) {
    for (const privatePath of ["/login", "/profile", "/mcp/oauth/consent", "/bay-area-agent-demo-2"]) {
      if (sitemap.includes(`<loc>${SITE_URL}${privatePath}</loc>`)) {
        errors.push(`sitemap.xml exposes private route ${privatePath}`);
      }
    }
  }

  return errors;
}

export function verifySeoBuild() {
  const outputDir = path.join(projectRoot, "dist", "public");
  const errors = collectSeoBuildErrors(outputDir, sitePages);
  if (errors.length > 0) {
    for (const error of errors) console.error(`SEO ERROR: ${error}`);
    return false;
  }

  console.log(`SEO build verified: ${sitePages.filter((page) => page.index).length} public pages, 0 errors.`);
  return true;
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath && !verifySeoBuild()) {
  process.exitCode = 1;
}
