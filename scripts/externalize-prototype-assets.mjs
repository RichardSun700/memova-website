import { createHash } from "node:crypto";

const extensions = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "font/woff": "woff",
  "font/woff2": "woff2",
};

// Replace only complete binary data URLs. In particular, leave the original
// asset-map keys, program structure and embedded case text untouched.
export function externalizePrototypeAssets(source, assetPrefix) {
  if (!/^\/assets\/[a-zA-Z0-9_-]+\/$/.test(assetPrefix)) {
    throw new Error("Prototype assets require a versioned absolute asset prefix");
  }
  const assets = new Map();
  const html = source.replace(
    /data:(image\/png|image\/jpeg|image\/webp|image\/svg\+xml|font\/woff2?);base64,([A-Za-z0-9+/]+={0,2})/g,
    (_url, mimeType, base64) => {
      const bytes = Buffer.from(base64, "base64");
      if (bytes.toString("base64") !== base64) {
        throw new Error(`Non-canonical prototype data URL: ${mimeType}`);
      }
      const sha256 = createHash("sha256").update(bytes).digest("hex");
      const path = `${assetPrefix}prototype-inline/${sha256}.${extensions[mimeType]}`;
      if (!assets.has(path)) assets.set(path, { path, bytes, sha256, mimeType });
      return path;
    },
  );
  return { html, assets: [...assets.values()] };
}
