import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { collectSeoBuildErrors } from "../../../scripts/verify-seo-build.mjs";
import { sitePages } from "./sitePages";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe("SEO build verification", () => {
  it("rejects an incomplete static output", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "memova-seo-empty-"));
    temporaryDirectories.push(directory);

    const errors = collectSeoBuildErrors(directory, sitePages);

    expect(errors.length).toBeGreaterThan(5);
    expect(errors.some((error) => error.includes("robots.txt"))).toBe(true);
    expect(errors.some((error) => error.includes("sitemap.xml"))).toBe(true);
  });

  it("accepts the generated production SEO output", () => {
    const output = path.resolve(process.cwd(), "dist/public");

    expect(collectSeoBuildErrors(output, sitePages)).toEqual([]);
  });
});
