import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  SITE_URL,
  SOCIAL_IMAGE,
  getCanonicalUrl,
  getSitePage,
  getStructuredData,
  sitePages,
} from "../client/src/seo/sitePages.ts";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(projectRoot, "dist", "public");

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttribute(value) {
  return escapeText(value).replaceAll('"', "&quot;");
}

function stripManagedHead(html) {
  return html
    .replace(/<title[^>]*>[\s\S]*?<\/title>/i, "")
    .replace(/<meta[^>]+(?:name|property)=["'](?:description|robots|og:[^"']+|twitter:[^"']+)["'][^>]*>\s*/gi, "")
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>\s*/gi, "")
    .replace(/<script[^>]+id=["']memova-structured-data["'][^>]*>[\s\S]*?<\/script>\s*/gi, "");
}

export function renderPageHtml(template, page) {
  const canonical = getCanonicalUrl(page);
  const robots = page.index
    ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    : "noindex, nofollow";
  const structuredData = JSON.stringify(getStructuredData(page)).replaceAll("<", "\\u003c");
  const head = `
    <title>${escapeText(page.title)}</title>
    <meta name="description" content="${escapeAttribute(page.description)}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${escapeAttribute(canonical)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Memova" />
    <meta property="og:title" content="${escapeAttribute(page.title)}" />
    <meta property="og:description" content="${escapeAttribute(page.description)}" />
    <meta property="og:url" content="${escapeAttribute(canonical)}" />
    <meta property="og:image" content="${escapeAttribute(SOCIAL_IMAGE)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <script id="memova-structured-data" type="application/ld+json">${structuredData}</script>`;
  const snapshot = `<div id="root"><main data-seo-snapshot="true"><article><h1>${escapeText(
    page.title,
  )}</h1><p>${escapeText(page.summary)}</p><p>${escapeText(
    page.description,
  )}</p><a href="/ios">Join Memova iOS Early Access</a></article></main></div>`;

  return stripManagedHead(template)
    .replace(/<html(?:\s+[^>]*)?>/i, '<html lang="en-US">')
    .replace("</head>", `${head}\n  </head>`)
    .replace(/<div id=["']root["']>\s*<\/div>/i, snapshot);
}

export function renderSitemap(pages) {
  const entries = pages
    .filter((page) => page.index)
    .map(
      (page) => `  <url>
    <loc>${escapeText(getCanonicalUrl(page))}</loc>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority.toFixed(2)}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

const protectedRules = [
  "Disallow: /login",
  "Disallow: /profile",
  "Disallow: /connected-clients",
  "Disallow: /settings/",
  "Disallow: /mcp/oauth/",
  "Disallow: /bay-area-agent-demo-2",
  "Disallow: /user-cases/demos/",
];

function crawlerGroup(userAgent) {
  return [`User-agent: ${userAgent}`, "Allow: /", ...protectedRules].join("\n");
}

export function renderRobots() {
  return `${crawlerGroup("*")}

${crawlerGroup("OAI-SearchBot")}

${crawlerGroup("PerplexityBot")}

User-agent: GPTBot
Disallow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

export function generateSeoPages() {
  const templatePath = path.join(outputDir, "index.html");
  const template = fs.readFileSync(templatePath, "utf8");

  for (const page of sitePages.filter((candidate) => candidate.index)) {
    const destination =
      page.path === "/"
        ? templatePath
        : path.join(outputDir, page.path.replace(/^\//, ""), "index.html");
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, renderPageHtml(template, page));
  }

  // Cloudflare Pages serves the root index as a SPA fallback when no top-level
  // 404.html exists. A real 404 document prevents unknown URLs from becoming
  // soft-404 homepage responses while keeping the explicit private rewrites.
  fs.writeFileSync(
    path.join(outputDir, "404.html"),
    renderPageHtml(template, getSitePage("/404")),
  );

  fs.writeFileSync(path.join(outputDir, "robots.txt"), renderRobots());
  fs.writeFileSync(path.join(outputDir, "sitemap.xml"), renderSitemap(sitePages));
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath) {
  generateSeoPages();
}
