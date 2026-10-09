import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { parseHTML } from "linkedom";
import { buildNeilManualCover } from "../../../scripts/build-neil-manual-cover.mjs";

const publicDir = path.resolve("client/public");
const manualDir = "personal-manual/neil-armstrong";
let output: string;
let source: ReturnType<typeof parseHTML>["document"];
let cover: ReturnType<typeof parseHTML>["document"];

beforeAll(async () => {
  output = await fs.mkdtemp(path.join(os.tmpdir(), "memova-original-cover-"));
  source = parseHTML(await fs.readFile(path.join(publicDir, manualDir, "index.html"), "utf8")).document;
  const result = await buildNeilManualCover(publicDir, output);
  cover = parseHTML(result.html).document;
}, 30000);
afterAll(async () => { if (output) await fs.rm(output, { recursive: true, force: true }); });

describe("original Neil manual cover", () => {
  it("preserves every original CSS rule, cover element and dialog", () => {
    expect([...cover.querySelectorAll("style")].map(node => node.textContent))
      .toEqual([...source.querySelectorAll("style")].map(node => node.textContent));
    const normalize = (node: Element) => {
      const copy = node.cloneNode(true) as Element;
      // Delivery attributes may differ; the original elements and styling may not.
      copy.querySelectorAll("img").forEach(img => {
        for (const attribute of ["src", "srcset", "sizes"]) img.removeAttribute(attribute);
      });
      copy.querySelectorAll("a").forEach(a => { a.removeAttribute("target"); a.removeAttribute("href"); });
      return copy.outerHTML;
    };
    for (const selector of [".topbar", "#top", "#breed-dialog", "#artifact-dialog"]) {
      expect(normalize(cover.querySelector(selector)!)).toBe(normalize(source.querySelector(selector)!));
    }
  });

  it("loads only the first page and its artwork", async () => {
    expect([...cover.querySelectorAll("main > section")].map(section => section.id)).toEqual(["top"]);
    expect(cover.querySelector("#style, #dimensions, #similar-paths, #operate, #summary, iframe")).toBeNull();
    expect(cover.querySelector('script[src], img[src^="data:"]')).toBeNull();
    for (const img of cover.querySelectorAll("img")) {
      expect(img.getAttribute("src")).toMatch(/^\.\/cover-assets\/\w+\.webp$/);
      expect((await fs.stat(path.resolve(output, manualDir, img.getAttribute("src")!))).size).toBeGreaterThan(0);
      for (const candidate of (img.getAttribute("srcset") || "").split(",").filter(Boolean)) {
        const [url, width] = candidate.trim().split(/\s+/);
        expect(url).toMatch(/^\.\/cover-assets\/\w+\.webp$/);
        expect(width).toMatch(/^\d+w$/);
        expect((await fs.stat(path.resolve(output, manualDir, url))).size).toBeGreaterThan(0);
      }
    }
    expect(cover.querySelector('.historical-note a')?.getAttribute("href")).toBe("./#evidence");
    expect(cover.documentElement.dataset.embed).toBe("true");
  });
});
