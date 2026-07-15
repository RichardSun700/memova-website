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
const privacyPolicyPath = path.join(
  projectRoot,
  "client",
  "src",
  "content",
  "privacy-policy.md",
);

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttribute(value) {
  return escapeText(value).replaceAll('"', "&quot;");
}

function cleanMarkdownText(value) {
  return value.replace(/\\([\\`*_[\]{}()#+\-.!>])/g, "$1").trim();
}

function renderInlineMarkdown(value) {
  const escaped = escapeText(cleanMarkdownText(value));
  const italic = escaped.match(/^\*(.+)\*$/);
  if (italic) return `<em>${italic[1]}</em>`;
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function parsePrivacyMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) continue;

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      blocks.push({ type: `h${heading[1].length}`, text: heading[2] });
      continue;
    }

    const listItem = line.match(/^-\s+(.+)$/);
    if (listItem) {
      const items = [listItem[1]];
      let cursor = index + 1;
      while (cursor < lines.length) {
        while (cursor < lines.length && !lines[cursor].trim()) cursor += 1;
        const nextItem = lines[cursor]?.trim().match(/^-\s+(.+)$/);
        if (!nextItem) break;
        items.push(nextItem[1]);
        index = cursor;
        cursor += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    const paragraph = [line];
    while (index + 1 < lines.length) {
      const nextLine = lines[index + 1].trim();
      if (!nextLine || /^(#{1,3})\s+/.test(nextLine) || /^-\s+/.test(nextLine)) break;
      paragraph.push(nextLine);
      index += 1;
    }
    blocks.push({ type: "p", text: paragraph.join(" ") });
  }

  return blocks;
}

function renderPrivacyBlocks(markdown) {
  return parsePrivacyMarkdown(markdown)
    .map((block, index) => {
      if (block.type === "h1") {
        return `<h1 class="font-serif text-[2.4rem] leading-tight text-[#0F2B3C] md:text-[3.2rem]">${renderInlineMarkdown(block.text)}</h1>`;
      }
      if (block.type === "h2") {
        return `<h2 class="mt-10 border-t border-[#E8F0F8] pt-8 text-[1.15rem] font-bold leading-tight text-[#0F2B3C] md:text-[1.35rem]">${renderInlineMarkdown(block.text)}</h2>`;
      }
      if (block.type === "h3") {
        return `<h3 class="mt-7 text-[0.98rem] font-bold leading-tight text-[#0F2B3C]">${renderInlineMarkdown(block.text)}</h3>`;
      }
      if (block.type === "ul") {
        const items = block.items
          .map((item) => `<li>${renderInlineMarkdown(item)}</li>`)
          .join("");
        return `<ul class="mt-4 list-disc space-y-2 pl-5 text-[14px] leading-7 text-[#2E5B82]/75 md:text-[15px]">${items}</ul>`;
      }
      const margin = index === 1 ? "mt-3" : "mt-5";
      return `<p class="${margin} text-[14px] leading-7 text-[#2E5B82]/75 md:text-[15px]">${renderInlineMarkdown(block.text)}</p>`;
    })
    .join("");
}

export function renderPrivacyPolicySnapshot(page) {
  const markdown = fs.readFileSync(privacyPolicyPath, "utf8");
  const policy = renderPrivacyBlocks(markdown);

  return `<div id="root"><div class="min-h-screen bg-[#FAFCFF] text-[#0F2B3C]"><header class="border-b border-[#E8F0F8]/70 bg-white/85"><div class="container flex min-h-[64px] items-center justify-between gap-4"><a href="/" class="flex items-center gap-2.5"><img alt="Memova" class="h-[1.8rem] w-[5.6rem] shrink-0 object-cover object-[50%_69%] mix-blend-multiply" src="/manus-storage/memova_logo_0eb30acc.png" /><span class="text-[13px] font-bold tracking-[0.18em] text-[#0F2B3C]">MEMOVA</span></a><a href="/" class="text-[13px] font-semibold text-[#2E5B82]/65">&larr; Home</a></div></header><main class="container py-12 md:py-16" data-seo-snapshot="true" data-page-summary="${escapeAttribute(page.summary)}"><div class="mx-auto max-w-3xl"><nav class="mb-8 flex flex-wrap gap-2" aria-label="Legal documents"><a href="/privacy" aria-current="page" class="rounded-full border border-[#0F2B3C] bg-[#0F2B3C] px-4 py-2 text-[12px] font-bold text-white">Privacy Policy</a><a href="/terms" class="rounded-full border border-[#DCEBF6] bg-white px-4 py-2 text-[12px] font-bold text-[#2E5B82]">Terms of Service</a></nav><article class="rounded-xl border border-[#DCEBF6] bg-white px-5 py-8 shadow-xl shadow-[#2E5B82]/[0.04] sm:px-8 md:px-10">${policy}</article></div></main></div></div>`;
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
  const snapshot =
    page.path === "/privacy"
      ? renderPrivacyPolicySnapshot(page)
      : `<div id="root"><main data-seo-snapshot="true"><article><h1>${escapeText(
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

export const LEGAL_SPA_ROUTES = ["/privacy-policy", "/privacy"];

export function writeLegalSpaShells(template, destinationDir) {
  const privacyPage = sitePages.find((page) => page.path === "/privacy");
  if (!privacyPage) throw new Error("Missing /privacy page metadata");
  const privacyHtml = renderPageHtml(template, privacyPage);

  for (const route of LEGAL_SPA_ROUTES) {
    const destination = path.join(
      destinationDir,
      `${route.replace(/^\//, "")}.html`,
    );
    fs.writeFileSync(destination, privacyHtml);
  }
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

  // Cloudflare Pages serves top-level HTML files at extensionless URLs.
  // Dedicated legal shells preserve /privacy-policy and /privacy while the
  // React router renders the corresponding LegalPage content client-side.
  writeLegalSpaShells(template, outputDir);

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
