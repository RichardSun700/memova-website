import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { transform } from "esbuild";
import sharp from "sharp";
import { prerenderProductionHomepage } from "./prerender-production-homepage.mjs";

const digest = value => createHash("sha256").update(value).digest("hex");
const imageExtension = /\.(png|jpe?g|webp|svg)$/i;

async function replaceAsync(source, pattern, replace) {
  const matches = [...source.matchAll(pattern)];
  const replacements = await Promise.all(matches.map(replace));
  let index = 0;
  return source.replace(pattern, () => replacements[index++]);
}

// This operates on the production source, not the separate Vite preview app.
// Keep the existing DOM, CSS cascade and script execution order intact.
export async function optimizeProductionHomepage(source, publicDir, outputDir) {
  const assetDir = path.join(outputDir, "assets", "homepage");
  fs.mkdirSync(assetDir, { recursive: true });
  const imageCache = new Map();
  const images = [];
  const writeAsset = (bytes, extension, label) => {
    const name = `${label}-${digest(bytes).slice(0, 20)}.${extension}`;
    fs.writeFileSync(path.join(assetDir, name), bytes);
    return `/assets/homepage/${name}`;
  };
  const emitImage = (input, extension, origin) => {
    const key = digest(input);
    if (!imageCache.has(key)) imageCache.set(key, (async () => {
      let output = input;
      let format = extension;
      // Lossless, original dimensions and metadata: no redesign, resampling or
      // lossy recompression of the existing artwork. Leave JPEG/SVG/WebP intact.
      if (extension === "png") {
        const candidate = await sharp(input).keepMetadata()
          .webp({ lossless: true, effort: 4 }).toBuffer();
        if (candidate.length < input.length) {
          output = candidate;
          format = "webp";
        }
      }
      const url = writeAsset(output, format, "image");
      images.push({ origin, url, sourceBytes: input.length, bytes: output.length });
      return url;
    })());
    return imageCache.get(key);
  };
  const localPath = (url, base = "/") => {
    const pathname = new URL(url, `https://memova.ai${base}`).pathname;
    const result = path.resolve(publicDir, `.${decodeURIComponent(pathname)}`);
    if (!result.startsWith(`${path.resolve(publicDir)}${path.sep}`)) {
      throw new Error(`Homepage asset escapes public directory: ${url}`);
    }
    return result;
  };
  const emitLocalImage = async (url, base = "/") => {
    const file = localPath(url, base);
    if (!fs.existsSync(file)) throw new Error(`Missing homepage image: ${url}`);
    return emitImage(fs.readFileSync(file), path.extname(file).slice(1).toLowerCase(),
      path.relative(publicDir, file));
  };
  const extractInlineImages = text => replaceAsync(text,
    /data:image\/(png|jpeg|webp|svg\+xml);base64,([A-Za-z0-9+/=]+)/g,
    match => emitImage(Buffer.from(match[2], "base64"),
      match[1] === "svg+xml" ? "svg" : match[1] === "jpeg" ? "jpg" : match[1],
      `inline:${digest(match[0]).slice(0, 20)}`));
  const optimizeScript = async text => {
    // Resolve only complete literal local image URLs, never dynamic templates,
    // external URLs, API endpoints or links to other pages.
    text = await replaceAsync(text,
      /(["'])((?:\.\/|\/)[^"'\s<>`$?#]+\.(?:png|jpe?g|webp|svg))\1/gi,
      async match => `${match[1]}${await emitLocalImage(match[2])}${match[1]}`);
    return extractInlineImages(text);
  };
  const optimizeCss = async (text, base) => {
    text = await replaceAsync(text, /url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)"']+))\s*\)/g,
      async match => {
        const url = match[1] ?? match[2] ?? match[3];
        if (url.startsWith("data:image/svg+xml,")) {
          const svg = Buffer.from(decodeURIComponent(url.slice("data:image/svg+xml,".length)));
          return `url("${await emitImage(svg, "svg", `inline:${digest(url).slice(0, 20)}`)}")`;
        }
        if (/^(?:data:|https?:|\/\/|#)/.test(url)) return match[0];
        const resolved = new URL(url, `https://memova.ai${base}`);
        const target = imageExtension.test(resolved.pathname)
          ? await emitLocalImage(url, base)
          : `${resolved.pathname}${resolved.search}${resolved.hash}`;
        return `url("${target}")`;
      });
    return extractInlineImages(text);
  };

  const styles = [];
  let html = await replaceAsync(source,
    /<style\b[^>]*>[\s\S]*?<\/style>|<link\b[^>]*rel="stylesheet"[^>]*>/gi,
    async match => {
      const tag = match[0];
      const position = match.index;
      if (tag.startsWith("<style")) {
        styles.push({ position, css: await optimizeCss(tag.replace(/^<style[^>]*>|<\/style>$/g, ""), "/") });
      } else {
        const href = tag.match(/href="([^"]+)"/)?.[1];
        if (!href || /^(?:https?:|\/\/)/.test(href)) throw new Error(`Unsupported homepage stylesheet: ${tag}`);
        const file = localPath(href);
        styles.push({ position, css: await optimizeCss(fs.readFileSync(file, "utf8"), new URL(href, "https://memova.ai/").pathname) });
      }
      return "";
    });
  const scripts = [];
  html = await replaceAsync(html, /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
    async match => {
      const [, attributes, body] = match;
      // Keep analytics module and structured data in their existing places.
      if (/\btype=/.test(attributes)) return match[0];
      const src = attributes.match(/src="([^"]+)"/)?.[1];
      const code = src ? fs.readFileSync(localPath(src), "utf8") : body;
      scripts.push({ position: match.index, code: await optimizeScript(code) });
      return "";
    });
  styles.sort((a, b) => a.position - b.position);
  scripts.sort((a, b) => a.position - b.position);
  const productionScript = scripts.find(entry => entry.code.includes("function ApolloHomepagePreview()"));
  const snapshot = productionScript ? prerenderProductionHomepage(productionScript.code) : null;
  if (source.includes('data-production-homepage="apollo-living-book-v1"') && !snapshot) {
    throw new Error("Cannot prerender the production homepage");
  }
  if (snapshot) {
    html = html.replace(/<main id="memova-static-snapshot"[\s\S]*?<\/main>/, () => snapshot.markup);
  }
  const css = styles.map(entry => entry.css).join("\n") + (snapshot?.css || "");
  const code = scripts.map(entry => entry.code).join("\n;\n");
  const js = (await transform(code, {
    loader: "js", target: "es2020", format: "iife", minify: true,
    legalComments: "inline", charset: "utf8",
  })).code;
  const cssUrl = writeAsset(Buffer.from(css), "css", "styles");
  const jsUrl = writeAsset(Buffer.from(js), "js", "app");
  const heroImage = code.match(/className: "kb-lunar-backdrop",[^\n]*?src: "([^"]+)"/)?.[1];
  html = html.replace("</head>", [
    heroImage ? `<link rel="preload" as="image" href="${heroImage}" fetchpriority="high">` : "",
    // Inline the existing styles so even a delayed/failed JS or CSS request
    // cannot expose the old plain-text SEO fallback or an unstyled hero.
    `<style id="memova-seo-shell-styles">${css}</style>`,
    `<script defer src="${jsUrl}"></script>`,
    "</head>",
  ].filter(Boolean).join("\n"));

  // These budgets apply to what visitors receive, not the authoring source.
  const sizes = {
    html: Buffer.byteLength(html), htmlGzip: gzipSync(html).length,
    javascript: Buffer.byteLength(js), javascriptGzip: gzipSync(js).length,
    css: Buffer.byteLength(css), cssGzip: gzipSync(css).length,
  };
  for (const key of ["htmlGzip", "javascriptGzip", "cssGzip"]) {
    if (sizes[key] > 100 * 1024) throw new Error(`Homepage ${key} exceeds 100 KiB: ${sizes[key]}`);
  }
  if (html.includes("data:image/")) throw new Error("Homepage still contains inline image payloads");
  fs.writeFileSync(path.join(outputDir, "index.html"), html);
  const report = { sizes, cssUrl, jsUrl, heroImage, images: images.sort((a, b) => a.url.localeCompare(b.url)) };
  fs.writeFileSync(path.join(outputDir, "homepage-assets.json"), JSON.stringify(report, null, 2));
  return report;
}
