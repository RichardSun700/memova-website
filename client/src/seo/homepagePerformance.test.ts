import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { runInNewContext } from "node:vm";
import { gzipSync } from "node:zlib";
import { afterEach, describe, expect, it } from "vitest";
import sharp from "sharp";
import { parseHTML } from "linkedom";
import { optimizeProductionHomepage } from "../../../scripts/optimize-production-homepage.mjs";

const temporaryDirectories: string[] = [];
afterEach(() => {
  for (const dir of temporaryDirectories.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe("production homepage performance", () => {
  it("does not spend the first-paint budget preloading gallery photos or offscreen demo media", async () => {
    const output = path.resolve("dist/public");
    const { document } = parseHTML(fs.readFileSync(path.join(output, "index.html"), "utf8"));
    const photos = [...document.querySelectorAll(".story-orbit img")];
    expect(photos).toHaveLength(9);
    const earlyPhotos = [...document.querySelectorAll('link[rel="preload"][as="image"]')]
      .filter(link => link.getAttribute("href")?.includes("/day-photos-v1/"));
    expect(earlyPhotos.length).toBe(0);
    let photoBytes = 0;
    for (const image of photos) {
      expect(image.getAttribute("loading")).toBe("lazy");
      const bytes = fs.readFileSync(path.join(output, image.getAttribute("src")!));
      photoBytes += bytes.length;
      expect((await sharp(bytes).metadata()).width).toBeLessThanOrEqual(640);
    }
    expect(photoBytes).toBeLessThan(300 * 1024);

    const icon = document.querySelector(".site-header .brand > img")!;
    const iconBytes = fs.readFileSync(path.join(output, icon.getAttribute("src")!));
    expect(iconBytes.length).toBeLessThan(40 * 1024);
    expect((await sharp(iconBytes).metadata()).width).toBeLessThanOrEqual(192);

    const demos = [...document.querySelectorAll(".product-demo-film video")];
    expect(demos).toHaveLength(3);
    for (const video of demos) {
      expect(video.hasAttribute("src")).toBe(false);
      expect(video.hasAttribute("poster")).toBe(false);
      expect(video.getAttribute("preload")).toBe("none");
    }
  });

  it("ships the real opening without waiting for a client render or downloading embedded demos", () => {
    const html = fs.readFileSync(path.resolve("dist/public/index.html"), "utf8");
    const { document } = parseHTML(html);
    const hero = document.querySelector('#root[data-seo-snapshot="true"] #top')!;
    expect(hero).not.toBeNull();
    expect(hero.querySelector("h1")?.textContent?.replace(/\s+/g, ""))
      .toBe("Recordallday.Buildyourknowledge.");
    expect(hero.querySelector(".hero-intro")?.textContent).toContain("Apple Watch");
    expect(hero.querySelector("video, iframe")).toBeNull();
    expect(document.querySelector(".kb-lunar-backdrop, .kb-orbit-card, #memova-desktop-snapshot")).toBeNull();
    expect(html).not.toContain("data:image/");
    expect(Buffer.byteLength(html)).toBeLessThan(512 * 1024);
    expect(gzipSync(html).length).toBeLessThan(128 * 1024);
  });

  it("resolves every built entry and stylesheet with bounded transfer size", () => {
    const output = path.resolve("dist/public");
    const { document } = parseHTML(fs.readFileSync(path.join(output, "index.html"), "utf8"));
    const modules = [...new Set([
      ...[...document.querySelectorAll('script[type="module"][src]')]
        .map(script => script.getAttribute("src")!),
      ...[...document.querySelectorAll('link[rel="modulepreload"][href]')]
        .map(link => link.getAttribute("href")!),
    ])];
    const styles = [...document.querySelectorAll('link[rel="stylesheet"][href]')]
      .map(link => link.getAttribute("href")!);
    expect(modules.length).toBeGreaterThan(0);
    expect(styles.length).toBeGreaterThan(0);
    let scriptGzip = 0;
    let cssGzip = 0;
    for (const [urls, kind] of [[modules, "javascript"], [styles, "css"]] as const) {
      for (const url of urls) {
        const pathname = new URL(url, "https://memova.ai").pathname;
        if (pathname === "/analytics/ga4-consent.js") expect(kind).toBe("javascript");
        else expect(pathname).toMatch(/^\/assets\/.+-[A-Za-z0-9_-]+\.(?:js|css)$/);
        const bytes = fs.readFileSync(path.join(output, pathname));
        const source = bytes.toString("utf8");
        expect(source).not.toMatch(/https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|terminal\.local)(?::\d+)?(?:[\/"'\s]|$)/);
        expect(source).not.toContain("/@vite/client");
        expect(source).not.toContain("__MANUS_HOST_DEV__");
        if (kind === "javascript") scriptGzip += gzipSync(bytes).length;
        else cssGzip += gzipSync(bytes).length;
      }
    }
    expect(scriptGzip).toBeLessThan(250 * 1024);
    expect(cssGzip).toBeLessThan(100 * 1024);
    const css = styles.map(url => fs.readFileSync(path.join(output, url), "utf8")).join("\n");
    expect(css).toContain("prefers-reduced-motion");
    expect(css).toContain("@media");
  });

  it("records deployable, reproducible homepage assets including every example entry", () => {
    const output = path.resolve("dist/public");
    const report = JSON.parse(fs.readFileSync(path.join(output, "homepage-assets.json"), "utf8"));
    const assets: { source: string; path: string; sha256: string; size: number }[] = report.assets;
    expect(Array.isArray(assets)).toBe(true);
    expect(assets.length).toBeGreaterThan(10);
    expect(new Set(assets.map(asset => asset.path)).size).toBe(assets.length);
    for (const asset of assets) {
      expect(asset.source).toBeTruthy();
      expect(asset.path).toMatch(/^\//);
      const file = path.resolve(output, `.${asset.path}`);
      expect(file.startsWith(output + path.sep), asset.path).toBe(true);
      const bytes = fs.readFileSync(file);
      expect(bytes.length, asset.path).toBe(asset.size);
      expect(bytes.length, asset.path).toBeLessThan(25 * 1024 * 1024);
      expect(createHash("sha256").update(bytes).digest("hex"), asset.path).toBe(asset.sha256);
    }
    for (const entry of ["/wind-chimes.html", "/mentor-classroom.html", "/examples/watch-prototype.html"]) {
      expect(assets.some(asset => asset.path === entry), entry).toBe(true);
    }
    const html = fs.readFileSync(path.join(output, "index.html"), "utf8");
    expect(html).not.toMatch(/https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|terminal\.local)(?::\d+)?(?:[\/"'\s]|$)/);
    expect(fs.existsSync(path.join(output, "_worker.js"))).toBe(false);
  });

  it("preserves script execution order, CSS order and lossless image pixels", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "memova-homepage-performance-"));
    temporaryDirectories.push(dir);
    const publicDir = path.join(dir, "public");
    const output = path.join(dir, "output");
    fs.mkdirSync(publicDir);
    const pixels = Buffer.alloc(64 * 64 * 4);
    for (let index = 0; index < pixels.length; index += 4) {
      pixels[index] = (index / 4) % 64;
      pixels[index + 1] = Math.floor(index / 256);
      pixels[index + 2] = 170;
      pixels[index + 3] = 128;
    }
    const png = await sharp(pixels, { raw: { width: 64, height: 64, channels: 4 } }).png().toBuffer();
    fs.writeFileSync(path.join(publicDir, "last.js"), 'window.order.push("last");');
    const svg = "<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'/><rect filter='url(#n)'/></svg>";
    fs.writeFileSync(path.join(publicDir, "last.css"),
      `.existing-design { color: blue; background: url("data:image/svg+xml,${encodeURIComponent(svg)}"); }`);
    const source = `<html><head><style>.existing-design { color: red; }</style></head>
      <body><main id="memova-static-snapshot">Visible while loading</main>
      <script>window.order = ["first"]; window.image = "data:image/png;base64,${png.toString("base64")}";</script>
      <link rel="stylesheet" href="./last.css"><script src="./last.js"></script></body></html>`;
    const result = await optimizeProductionHomepage(source, publicDir, output);
    const window: { order?: string[]; image?: string } = {};
    runInNewContext(fs.readFileSync(path.join(output, result.jsUrl), "utf8"), { window });
    expect(window.order).toEqual(["first", "last"]);
    const decoded = await sharp(fs.readFileSync(path.join(output, window.image!))).ensureAlpha().raw().toBuffer();
    expect(decoded).toEqual(pixels);
    const css = fs.readFileSync(path.join(output, result.cssUrl), "utf8");
    expect(css.indexOf("color:red")).toBeLessThan(css.indexOf("color:#00f"));
    const svgAsset = result.images.find((image: { url: string }) => image.url.endsWith(".svg"));
    expect(fs.readFileSync(path.join(output, svgAsset!.url), "utf8")).toBe(svg);
    expect(css).not.toContain("data:image/");
  });
});
