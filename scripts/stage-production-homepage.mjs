import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";
import react from "@vitejs/plugin-react";
import { parseHTML } from "linkedom";
import { buildNeilManualCover } from "./build-neil-manual-cover.mjs";
import { externalizePrototypeAssets } from "./externalize-prototype-assets.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "homepage-watch");
const output = path.join(root, "dist/public");
const client = path.join(root, "dist/watch-homepage");
const server = path.join(root, "dist/watch-ssr");
const limit = 25 * 1024 * 1024;
const hash = bytes => createHash("sha256").update(bytes).digest("hex");

function filesIn(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(entry => entry.isDirectory()
      ? filesIn(path.join(directory, entry.name))
      : [path.join(directory, entry.name)]);
}

// Keep all legacy generated pages, API inputs and bundles before staging home.
const inventory = JSON.parse(fs.readFileSync(path.join(source, "public-files.json"), "utf8"));
const actualPublic = filesIn(path.join(source, "public"))
  .map(file => path.relative(path.join(source, "public"), file).split(path.sep).join("/")).sort();
if (JSON.stringify(actualPublic) !== JSON.stringify(inventory.files.map(file => file.path).sort())) {
  throw new Error("Homepage public files differ from the reviewed publishing inventory");
}
for (const item of inventory.files) {
  const bytes = fs.readFileSync(path.join(source, "public", item.path));
  if (bytes.length !== item.sizeBytes || hash(bytes) !== item.sha256 || bytes.length >= limit) {
    throw new Error(`Homepage public inventory mismatch: ${item.path}`);
  }
}
const legacyHtml = fs.readFileSync(path.join(output, "index.html"), "utf8");
const { document: legacy } = parseHTML(legacyHtml);
await buildNeilManualCover(path.join(root, "client/public"), output);
await build({ configFile: path.join(source, "vite.config.mjs"), logLevel: "warn" });
await build({
  configFile: false,
  root: source,
  plugins: [react()],
  logLevel: "warn",
  build: {
    outDir: server,
    emptyOutDir: true,
    copyPublicDir: false,
    ssr: path.join(source, "src/entry-server.jsx"),
    rollupOptions: { output: { entryFileNames: "entry-server.mjs" } },
  },
});
const { renderHomepage } = await import(pathToFileURL(path.join(server, "entry-server.mjs")));
const markup = renderHomepage();
const builtFiles = filesIn(client);
const revisionHash = createHash("sha256");
for (const file of builtFiles) revisionHash.update(path.relative(client, file)).update(fs.readFileSync(file));
// Publishing transforms also affect the bytes served under immutable paths.
revisionHash.update(fs.readFileSync(fileURLToPath(import.meta.url)));
revisionHash.update(fs.readFileSync(new URL("./externalize-prototype-assets.mjs", import.meta.url)));
revisionHash.update(markup);
const revision = revisionHash.digest("hex").slice(0, 16);
const assetPrefix = `/assets/watch-${revision}/`;
// Content-address every new asset, including plain-named videos and fonts, to
// retain the existing immutable cache policy without stale content on updates.
const rewriteAssets = text => text
  .replaceAll("/assets/", assetPrefix)
  .replaceAll('"assets/', `"${assetPrefix.slice(1)}`)
  .replaceAll("'assets/", `'${assetPrefix.slice(1)}`);
const records = [];
const prototypeAssets = new Map();
const externalizedExamples = new Set([
  "examples/watch-prototype.html",
  "examples/MyDay_Workplace_Conversation_Reference_Layout.html",
]);
for (const file of builtFiles) {
  const relative = path.relative(client, file).split(path.sep).join("/");
  if (relative === "index.html") continue;
  const targetRelative = relative.startsWith("assets/")
    ? assetPrefix.slice(1) + relative.slice("assets/".length) : relative;
  let data = fs.readFileSync(file);
  if ((relative.startsWith("assets/") && /\.(?:js|css)$/.test(relative)) ||
      ["wind-chimes.html", "mentor-classroom.html"].includes(relative)) {
    data = Buffer.from(rewriteAssets(data.toString("utf8")));
  } else if (relative.startsWith("examples/") && relative.endsWith(".html")) {
    // Only actual external URLs change. Preserve source words and embedded
    // asset-map keys in the complete exported prototypes.
    data = Buffer.from(data.toString("utf8")
      .replaceAll("/assets/memova-icon-transparent.png", assetPrefix + "memova-icon-transparent.png")
      .replaceAll("/assets/myday-cover-layout.css", assetPrefix + "myday-cover-layout.css"));
  }
  if (externalizedExamples.has(relative)) {
    const externalized = externalizePrototypeAssets(data.toString("utf8"), assetPrefix);
    data = Buffer.from(externalized.html);
    for (const asset of externalized.assets) {
      if (!prototypeAssets.has(asset.path)) prototypeAssets.set(asset.path, { ...asset, source: relative });
    }
  }
  if (data.length >= limit) throw new Error(`Pages asset exceeds25MiB: ${relative}`);
  const target = path.join(output, targetRelative);
  if (fs.existsSync(target) && !fs.readFileSync(target).equals(data)) {
    throw new Error(`New homepage would overwrite an existing route/asset: ${targetRelative}`);
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, data);
  records.push({ source: relative, path: "/" + targetRelative, sha256: hash(data), size: data.length });
}
for (const asset of prototypeAssets.values()) {
  if (asset.bytes.length >= limit) throw new Error(`Prototype asset exceeds25MiB: ${asset.path}`);
  const target = path.join(output, asset.path.slice(1));
  if (fs.existsSync(target) && !fs.readFileSync(target).equals(asset.bytes)) {
    throw new Error(`Prototype asset would overwrite different bytes: ${asset.path}`);
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, asset.bytes);
  records.push({ source: `${asset.source}#inline:${asset.sha256}`, path: asset.path, sha256: asset.sha256, size: asset.bytes.length });
}

let html = rewriteAssets(fs.readFileSync(path.join(client, "index.html"), "utf8"));
const { document: homepage } = parseHTML(html);
// Match the English SSR snapshot and client default before JavaScript runs.
homepage.documentElement.lang = "en";
const retainedHead = [...legacy.head.querySelectorAll(
  'title,meta[name="description"],meta[name="robots"],meta[property^="og:"],meta[name^="twitter:"],link[rel="canonical"],link[rel="icon"],link[rel="apple-touch-icon"],link[rel="manifest"],script[type="application/ld+json"]'
)];
for (const node of retainedHead) {
  const tag = node.tagName.toLowerCase();
  let selector;
  if (tag === "title") selector = "title";
  else if (tag === "meta") selector = node.hasAttribute("name")
    ? `meta[name="${node.getAttribute("name")}"]` : `meta[property="${node.getAttribute("property")}"]`;
  else if (tag === "link") selector = `link[rel="${node.getAttribute("rel")}"][href="${node.getAttribute("href")}"]`;
  else selector = 'script[type="application/ld+json"]';
  homepage.head.querySelectorAll(selector).forEach(existing => existing.remove());
  homepage.head.appendChild(node.cloneNode(true));
}
const analytics = legacy.querySelector('script[src^="/analytics/ga4-consent.js"]');
if (!analytics) throw new Error("Missing existing consent-aware analytics bootstrap");
homepage.head.appendChild(analytics.cloneNode(true));
const mount = homepage.getElementById("root");
if (!mount) throw new Error("Missing new homepage root");
mount.setAttribute("data-production-homepage", "watch-life-v1");
mount.setAttribute("data-seo-snapshot", "true");
mount.setAttribute("data-homepage-revision", revision);
mount.innerHTML = rewriteAssets(markup);
// Keep existing inbound section links useful during the homepage migration.
for (const [id, destination] of Object.entries({ waitlist: "download", capture: "experience", act: "experience" })) {
  if (homepage.getElementById(id)) continue;
  const node = homepage.createElement("span");
  node.id = id;
  node.setAttribute("aria-hidden", "true");
  homepage.getElementById(destination)?.prepend(node);
}
html = homepage.toString();
if (!/^<!doctype/i.test(html)) html = "<!doctype html>\n" + html;
if (Buffer.byteLength(html) >= limit) throw new Error("Homepage HTML exceeds Pages limit");
fs.writeFileSync(path.join(output, "index.html"), html);
records.push({ source: "index.html", path: "/index.html", sha256: hash(Buffer.from(html)), size: Buffer.byteLength(html) });
fs.writeFileSync(path.join(output, "homepage-assets.json"), JSON.stringify({ revision, assets: records }, null, 2) + "\n");
console.log(`Staged Watch homepage: ${records.length} files, revision ${revision}, SSR ${Buffer.byteLength(html)} bytes`);
