import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { build } from "vite";
import { build as bundle } from "esbuild";
import { parseHTML } from "linkedom";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "dist/enterprise");
await build({ configFile: path.join(root, "vite.enterprise.config.ts") });
for (const directory of ["brand", "fonts", "enterprise/institutions"]) {
  fs.cpSync(
    path.join(root, "client/public", directory),
    path.join(out, directory),
    { recursive: true }
  );
}
const renderer = path.join(root, "dist/enterprise-renderer.mjs");
await bundle({
  entryPoints: [path.join(root, "enterprise-site/render.tsx")],
  outfile: renderer,
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  jsx: "automatic",
  loader: { ".css": "empty" },
  alias: { "@": path.join(root, "client/src") },
});
const { render } = await import(pathToFileURL(renderer).href);
const template = fs.readFileSync(path.join(out, "index.html"), "utf8");
function renderPage(pathname, title, description) {
  const { document } = parseHTML(template);
  const canonical = new URL(pathname, "https://enterprise.memova.ai").href;
  document.querySelector("#root").innerHTML = render(pathname);
  document.title = title;
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('link[rel="canonical"]').href = canonical;
  for (const [name, content] of Object.entries({
    "og:title": title,
    "og:description": description,
    "og:url": canonical,
  })) {
    document.querySelector(`meta[property="${name}"]`).content = content;
  }
  const schema = document.createElement("script");
  schema.type = "application/ld+json";
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": pathname === "/contact" ? "ContactPage" : "WebPage",
    "@id": canonical + "#webpage",
    url: canonical,
    name: title,
    description,
  }).replace(/</g, "\\u003c");
  document.head.appendChild(schema);
  return document.toString();
}
const html = renderPage(
  "/",
  "Memova for Business | Enterprise Knowledge & Local AI",
  "Enterprise knowledge bases, authorized data engineering, model training and private deployment for business and industrial teams."
);
fs.writeFileSync(path.join(out, "index.html"), html);
const contactPage = renderPage(
  "/contact",
  "Contact our team | Memova for Business",
  "Contact Memova about enterprise knowledge bases, authorized data, model training and private AI deployment. Our team will follow up by email."
).replace(
  /(<span class="ent-contact-address"[^>]*>.*?<\/span>)/g,
  "<!--email_off-->$1<!--/email_off-->"
);
fs.writeFileSync(path.join(out, "contact.html"), contactPage);
fs.copyFileSync(
  path.join(root, "enterprise-site/_worker.js"),
  path.join(out, "_worker.js")
);
fs.writeFileSync(
  path.join(out, "_routes.json"),
  JSON.stringify({ version: 1, include: ["/api/contact"], exclude: [] })
);
fs.writeFileSync(
  path.join(out, "robots.txt"),
  ["*", "OAI-SearchBot", "PerplexityBot"]
    .map(agent => `User-agent: ${agent}\nAllow: /\nDisallow: /api/\n`)
    .join("\n") +
    "\nUser-agent: GPTBot\nDisallow: /\n\nSitemap: https://enterprise.memova.ai/sitemap.xml\n"
);
fs.writeFileSync(
  path.join(out, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://enterprise.memova.ai/</loc></url><url><loc>https://enterprise.memova.ai/contact</loc></url></urlset>'
);
fs.writeFileSync(
  path.join(out, "404.html"),
  '<!doctype html><html lang="en"><meta charset="UTF-8"><meta name="robots" content="noindex"><title>Page not found | Memova for Business</title><h1>Page not found</h1><a href="/">Memova for Business</a></html>'
);
fs.writeFileSync(
  path.join(out, "_headers"),
  "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n"
);
fs.writeFileSync(
  path.join(out, "enterprise-release.json"),
  JSON.stringify(
    {
      site: "enterprise.memova.ai",
      project: "memova-enterprise",
      commit: execFileSync("git", ["rev-parse", "HEAD"], {
        cwd: root,
        encoding: "utf8",
      }).trim(),
    },
    null,
    2
  )
);
console.log("Enterprise-only build ready:", out);
await bundle({
  entryPoints: [path.join(root, "worker/enterprise/index.mjs")],
  outfile: path.join(root, "dist/enterprise-contact-worker.mjs"),
  bundle: true,
  format: "esm",
  platform: "browser",
  external: ["cloudflare:email"],
});
