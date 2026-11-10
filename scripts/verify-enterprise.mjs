import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { parseHTML } from "linkedom";
const out = path.resolve(import.meta.dirname, "../dist/enterprise");
const html = fs.readFileSync(path.join(out, "index.html"), "utf8");
const { document } = parseHTML(html);
function verifyMetadata(page, pathname, schemaType) {
  const canonical = new URL(pathname, "https://enterprise.memova.ai").href;
  const description = page.querySelector('meta[name="description"]').content;
  assert.ok(description.length > 40);
  assert.equal(page.querySelectorAll('link[rel="canonical"]').length, 1);
  assert.equal(page.querySelector('link[rel="canonical"]').href, canonical);
  assert.equal(
    page.querySelector('meta[property="og:url"]').content,
    canonical
  );
  assert.equal(
    page.querySelector('meta[property="og:title"]').content,
    page.title
  );
  assert.equal(
    page.querySelector('meta[property="og:description"]').content,
    description
  );
  const schema = JSON.parse(
    page.querySelector('script[type="application/ld+json"]').textContent
  );
  assert.equal(schema["@type"], schemaType);
  assert.equal(schema.url, canonical);
  assert.equal(schema.name, page.title);
  assert.equal(schema.description, description);
}
verifyMetadata(document, "/", "WebPage");
assert.equal(
  document.querySelector('link[rel="canonical"]').getAttribute("href"),
  "https://enterprise.memova.ai/"
);
assert.ok(document.querySelector(".ent-site-header"));
assert.ok(document.querySelector(".ent-site-footer"));
assert.ok(document.querySelector("#industrial"));
for (const link of document.querySelectorAll("header a,footer a"))
  assert.match(link.getAttribute("href"), /^(#|\/contact)/);
assert.equal(
  document.querySelectorAll(".memova-watch-header,.mw-signin").length,
  0
);
for (const image of document.querySelectorAll("img"))
  assert.ok(
    fs.existsSync(path.join(out, image.getAttribute("src"))),
    image.getAttribute("src")
  );
for (const asset of document.querySelectorAll(
  'script[src],link[rel="stylesheet"]'
))
  assert.ok(
    fs.existsSync(
      path.join(out, asset.getAttribute("src") || asset.getAttribute("href"))
    )
  );
for (const forbidden of ["demo", "login", "mcp", "profile"])
  assert.equal(fs.existsSync(path.join(out, forbidden)), false);
assert.match(
  fs.readFileSync(path.join(out, "robots.txt"), "utf8"),
  /enterprise\.memova\.ai/
);
const robots = fs.readFileSync(path.join(out, "robots.txt"), "utf8");
for (const agent of ["*", "OAI-SearchBot", "PerplexityBot"])
  assert.ok(robots.includes(`User-agent: ${agent}\nAllow: /\nDisallow: /api/`));
assert.ok(robots.includes("User-agent: GPTBot\nDisallow: /"));
assert.match(fs.readFileSync(path.join(out, "404.html"), "utf8"), /noindex/);
console.log(
  "Enterprise boundary verified: isolated navigation, SSR, assets, canonical, sitemap and no consumer routes."
);
const { document: contact } = parseHTML(
  fs.readFileSync(path.join(out, "contact.html"), "utf8")
);
verifyMetadata(contact, "/contact", "ContactPage");
assert.notEqual(contact.title, document.title);
assert.notEqual(
  contact.querySelector('meta[name="description"]').content,
  document.querySelector('meta[name="description"]').content
);
const { document: sitemap } = parseHTML(
  fs.readFileSync(path.join(out, "sitemap.xml"), "utf8")
);
assert.deepEqual(
  [...sitemap.querySelectorAll("loc")].map(node => node.textContent),
  ["https://enterprise.memova.ai/", "https://enterprise.memova.ai/contact"]
);
assert.equal(
  contact.querySelector('link[rel="canonical"]').getAttribute("href"),
  "https://enterprise.memova.ai/contact"
);
assert.equal(
  contact.querySelector("form").getAttribute("action"),
  "/api/contact"
);
assert.ok(contact.querySelector("#contact-email[required]"));
assert.equal(contact.querySelector('a[href^="mailto:"]'), null);
assert.ok(fs.existsSync(path.join(out, "_worker.js")));
assert.deepEqual(
  JSON.parse(fs.readFileSync(path.join(out, "_routes.json"), "utf8")).include,
  ["/api/contact"]
);
console.log(
  "Contact page verified: server-rendered form, independent canonical and API-only Worker routing."
);
