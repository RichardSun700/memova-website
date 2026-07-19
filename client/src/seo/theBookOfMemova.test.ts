import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(process.cwd());
const publicRoot = path.join(projectRoot, "client/public");
const bookRoot = path.join(publicRoot, "thebookofmemova");

describe("The Book of Memova static route", () => {
  it("publishes the approved v0.5 book contract and every declared page", () => {
    const home = fs.readFileSync(path.join(bookRoot, "index.html"), "utf8");
    const manifest = JSON.parse(
      fs.readFileSync(path.join(bookRoot, "manifest.json"), "utf8"),
    );

    expect(home).toContain("人的价值，不在于被记录，而在于持续被理解。");
    expect(home).toContain("Memova 的第一把尖刀");
    expect(home).toContain("Direct Link · Noindex");
    expect(home).not.toContain("Internal · Unshared");
    expect(manifest.version).toBe("0.5");
    expect(manifest.visibility).toBe("direct-link-noindex");
    expect(manifest.chapters).toHaveLength(4);
    expect(manifest.pages).toHaveLength(10);
    expect(manifest.pages.some((page: { id: string }) => page.id === "memo-000001")).toBe(false);

    for (const page of manifest.pages) {
      expect(fs.existsSync(path.join(bookRoot, page.path)), page.path).toBe(true);
      expect(fs.existsSync(path.join(bookRoot, page.canonical_markdown)), page.canonical_markdown).toBe(true);
    }
  });

  it("keeps the direct-link book noindex and excludes historical raw archives", () => {
    const headers = fs.readFileSync(path.join(publicRoot, "_headers"), "utf8");
    const redirects = fs.readFileSync(path.join(publicRoot, "_redirects"), "utf8");
    const validationReport = fs.readFileSync(path.join(bookRoot, "validation-report.md"), "utf8");

    expect(headers).toContain("/thebookofmemova/*");
    expect(redirects).toContain("/thebookofmemova /thebookofmemova/ 301");
    expect(validationReport).toContain("https://memova.ai/thebookofmemova/");
    expect(fs.existsSync(path.join(bookRoot, "company/memo-000001.html"))).toBe(false);
    expect(fs.existsSync(path.join(bookRoot, "content/memo-000001.md"))).toBe(false);
    for (const version of ["v0.2", "v0.3", "v0.4"]) {
      expect(fs.existsSync(path.join(bookRoot, `memova-company-memory-book-${version}.zip`))).toBe(false);
    }
  });
});
