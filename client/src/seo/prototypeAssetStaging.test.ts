import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { externalizePrototypeAssets } from "../../../scripts/externalize-prototype-assets.mjs";

const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");

describe("published prototype binary assets", () => {
  it("deduplicates exact bytes while preserving map keys, nested source and unknown data types", () => {
    const bytes = Buffer.from([0, 255, 17, 42]);
    const image = `data:image/png;base64,${bytes.toString("base64")}`;
    const font = `data:font/woff2;base64,${Buffer.from("font bytes").toString("base64")}`;
    const source = `const assets={"/assets/original.png":"${image}","${image}":"${image}"};
      const nested="<img src=\\\"${image}\\\">";
      const css='@font-face{src:url("${font}")}';
      const untouched='data:application/octet-stream;base64,AA==';`;
    const result = externalizePrototypeAssets(source, "/assets/watch-fixture/");
    expect(result.assets).toHaveLength(2);
    const imageAsset = result.assets.find((asset: { mimeType: string }) => asset.mimeType === "image/png")!;
    expect(imageAsset.bytes).toEqual(bytes);
    expect(result.html).toContain(`"/assets/original.png":"${imageAsset.path}"`);
    expect(result.html).toContain(`"${imageAsset.path}":"${imageAsset.path}"`);
    expect(result.html).toContain("data:application/octet-stream;base64,AA==");
    let restored = result.html;
    for (const asset of result.assets) restored = restored.replaceAll(asset.path, `data:${asset.mimeType};base64,${asset.bytes.toString("base64")}`);
    expect(restored).toBe(source);
  });

  it("publishes the two complete cases with byte-identical images/fonts and one manifest entry per asset", () => {
    const output = path.resolve("dist/public");
    const manifest = JSON.parse(fs.readFileSync(path.join(output, "homepage-assets.json"), "utf8"));
    const prefix = `/assets/watch-${manifest.revision}/`;
    const expected = new Map<string, Buffer>();
    for (const filename of ["watch-prototype.html", "MyDay_Workplace_Conversation_Reference_Layout.html"]) {
      const source = fs.readFileSync(path.resolve("homepage-watch/public/examples", filename), "utf8");
      const transformed = externalizePrototypeAssets(source, prefix);
      const published = fs.readFileSync(path.join(output, "examples", filename), "utf8");
      const expectedHtml = transformed.html
        .replaceAll("/assets/memova-icon-transparent.png", prefix + "memova-icon-transparent.png")
        .replaceAll("/assets/myday-cover-layout.css", prefix + "myday-cover-layout.css");
      // Equality of the complete document protects every quote, HRV Demo label,
      // script and interaction; this is more exact than checking selected words.
      expect(hash(published), filename).toBe(hash(expectedHtml));
      expect(Buffer.byteLength(published), filename).toBeLessThan(Buffer.byteLength(source) / 4);
      for (const asset of transformed.assets) expected.set(asset.path, asset.bytes);
    }
    const records = manifest.assets.filter((asset: { path: string }) => asset.path.includes("/prototype-inline/"));
    expect(records).toHaveLength(expected.size);
    expect(new Set(records.map((asset: { path: string }) => asset.path)).size).toBe(expected.size);
    for (const [url, bytes] of expected) {
      const actual = fs.readFileSync(path.join(output, url.slice(1)));
      expect(actual.equals(bytes), url).toBe(true);
      const record = records.find((asset: { path: string }) => asset.path === url);
      expect(record?.sha256, url).toBe(hash(bytes));
      expect(record?.size, url).toBe(bytes.length);
    }
  });
});
