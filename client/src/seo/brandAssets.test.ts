import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { parseHTML } from "linkedom";
import { getSitePage, getStructuredData, SOCIAL_IMAGE } from "./sitePages";

const read = (file: string) => fs.readFileSync(path.resolve(file));

describe("official Memova brand assets", () => {
  it("keeps the approved final app icon and its homepage copy byte-identical", () => {
    const source = read("client/public/brand/memova-app-icon-liquid-blue.svg");
    expect(createHash("sha256").update(source).digest("hex"))
      .toBe("3385e77ffd04ce6557d69cabd2b9f1aeb1aa3201699570276cdf6b3d67af7245");
    expect(read("homepage-watch/public/assets/memova-app-icon-liquid-blue.svg").equals(source)).toBe(true);
  });

  it("uses the official letter paths and primary blue without raster cropping or filters", () => {
    const source = read("client/public/brand/memova-wordmark-blue.svg");
    const { document } = parseHTML(source.toString());
    expect(document.querySelectorAll("path")).toHaveLength(6);
    expect(document.querySelector("svg")?.getAttribute("viewBox")).toBe("23 423 668.25 81.5");
    expect(source.toString()).toContain("#6B86E8");
    expect(source.toString()).not.toMatch(/<image|<filter|<script|data:image/i);
    expect(read("homepage-watch/public/assets/memova-wordmark-blue.svg").equals(source)).toBe(true);
  });

  it("uses the official app icon in social previews and publisher metadata", () => {
    expect(SOCIAL_IMAGE).toBe("https://memova.ai/brand/memova-app-icon-512.png");
    expect(getStructuredData(getSitePage("/")).publisher.logo).toBe(SOCIAL_IMAGE);
    expect(read("client/public/brand/memova-app-icon-512.png").length).toBeGreaterThan(0);
  });
});
