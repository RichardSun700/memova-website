import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { Script, runInNewContext } from "node:vm";
import { afterEach, describe, expect, it } from "vitest";
import sharp from "sharp";
import { parseHTML } from "linkedom";
import { optimizeProductionHomepage } from "../../../scripts/optimize-production-homepage.mjs";

const temporaryDirectories: string[] = [];
afterEach(() => {
  for (const dir of temporaryDirectories.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe("production homepage performance", () => {
  it("ships a small, renderable HTML shell and cacheable assets within the budgets", () => {
    const output = path.resolve("dist/public");
    const html = fs.readFileSync(path.join(output, "index.html"), "utf8");
    const report = JSON.parse(fs.readFileSync(path.join(output, "homepage-assets.json"), "utf8"));
    expect(Buffer.byteLength(html)).toBeLessThan(512 * 1024);
    expect(html).toContain('id="memova-static-snapshot"');
    const { document } = parseHTML(html);
    const snapshot = document.getElementById("memova-static-snapshot")!;
    expect(snapshot.querySelector("h1")?.textContent).toBe("Your context,finally understood.");
    expect(snapshot.querySelector(".five-header")).not.toBeNull();
    expect(snapshot.querySelector(".kb-lunar-backdrop")?.getAttribute("src")).toBe(report.heroImage);
    expect(snapshot.querySelectorAll(".kb-orbit-card")).toHaveLength(7);
    expect([...snapshot.querySelectorAll(".five-page-rail a")].map(link => link.getAttribute("href")))
      .toEqual(["#top", "#capture", "#act", "#share", "#return", "#waitlist"]);
    expect(snapshot.textContent).not.toContain("Personal superalignment");
    expect(document.querySelector('link[rel="stylesheet"]')).toBeNull();
    const initialStyles = document.querySelector("head > style#memova-seo-shell-styles")?.textContent;
    expect(initialStyles).toContain(".kb-lunar-backdrop");
    expect(initialStyles).toContain("--snapshot-compact-left");
    expect(html).not.toContain("?.remove()");
    expect(html).not.toContain("data:image/");
    expect(html.match(/<script defer src=/g)).toHaveLength(1);
    expect(html).toContain(`as="image" href="${report.heroImage}" fetchpriority="high"`);
    for (const metric of ["htmlGzip", "javascriptGzip", "cssGzip"]) {
      expect(report.sizes[metric]).toBeLessThan(100 * 1024);
    }
    for (const url of [report.jsUrl, report.cssUrl, ...report.images.map((image: { url: string }) => image.url)]) {
      const bytes = fs.readFileSync(path.join(output, url));
      const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 20);
      expect(url).toContain(`/assets/homepage/`);
      expect(url).toContain(hash);
    }
    const js = fs.readFileSync(path.join(output, report.jsUrl), "utf8");
    expect(() => new Script(js)).not.toThrow();
    expect(js).not.toContain("/demo/media/memova-pairs//assets/");
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
    expect(css.indexOf("color: red")).toBeLessThan(css.indexOf("color: blue"));
    const svgAsset = result.images.find((image: { url: string }) => image.url.endsWith(".svg"));
    expect(fs.readFileSync(path.join(output, svgAsset!.url), "utf8")).toBe(svg);
    expect(css).not.toContain("data:image/");
  });
});
