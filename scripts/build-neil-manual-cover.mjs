import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { parseHTML } from "linkedom";
import sharp from "sharp";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manualPath = "personal-manual/neil-armstrong";

// Reuse the approved document's first section and CSS. The homepage must not
// recreate the cover or load the chapters and artwork below it.
export async function buildNeilManualCover(publicDir, outputDir) {
  const source = await fs.readFile(path.join(publicDir, manualPath, "index.html"), "utf8");
  const { document } = parseHTML(source);
  const cover = document.querySelector("#top");
  const header = document.querySelector(".topbar");
  const navigation = document.querySelector(".side-nav");
  if (!cover || !header || !navigation) throw new Error("Neil's original cover is missing.");

  const main = document.createElement("main");
  main.className = "site";
  main.append(header, cover);
  const dialogs = [...document.querySelectorAll("dialog")];
  const originalScript = [...document.querySelectorAll("script:not([src])")]
    .map(script => script.textContent).join("\n");
  document.body.replaceChildren(navigation, main, ...dialogs);
  document.documentElement.dataset.embed = "true";
  document.head.querySelectorAll("script").forEach(script => script.remove());
  const robots = document.createElement("meta");
  robots.name = "robots";
  robots.content = "noindex,nofollow";
  document.head.append(robots);

  const assetsDir = path.join(outputDir, manualPath, "cover-assets");
  await fs.mkdir(assetsDir, { recursive: true });
  let assetBytes = 0;
  for (const img of document.querySelectorAll("img")) {
    const originalUrl = img.getAttribute("src");
    const input = await fs.readFile(path.resolve(publicDir, manualPath, originalUrl));
    let pipeline = sharp(input);
    if (originalUrl.includes("/dimensions/")) {
      pipeline = pipeline.resize({ width: 256, height: 256, fit: "inside", withoutEnlargement: true });
    }
    const bytes = await pipeline.webp({ lossless: true, effort: 4 }).toBuffer();
    const name = createHash("sha256").update(bytes).digest("hex").slice(0, 16) + ".webp";
    await fs.writeFile(path.join(assetsDir, name), bytes);
    img.setAttribute("src", "./cover-assets/" + name);
    const metadata = await sharp(bytes).metadata();
    // Preserve the original cover composition; deliver a smaller copy of the
    // same illustration at its actual phone display size.
    if (!originalUrl.includes("/dimensions/") && metadata.width > 600) {
      const small = await sharp(input).resize({ width: 480 }).webp({ quality: 90, effort: 4 }).toBuffer();
      const smallName = createHash("sha256").update(small).digest("hex").slice(0, 16) + ".webp";
      await fs.writeFile(path.join(assetsDir, smallName), small);
      assetBytes += small.length;
      img.setAttribute("srcset", `./cover-assets/${smallName} 480w, ./cover-assets/${name} ${metadata.width}w`);
      img.setAttribute("sizes", "(max-width: 760px) 54vw, 52vw");
    }
    assetBytes += bytes.length;
  }
  // Links out of the first page open the original complete document in the host.
  document.querySelector('.historical-note a').setAttribute("href", "./#evidence");
  document.querySelectorAll("a").forEach(link => link.setAttribute("target", "_parent"));
  const script = document.createElement("script");
  script.textContent = originalScript + `
(() => {
  const report = () => parent.postMessage({
    source: "neil-manual-cover",
    height: Math.ceil(document.querySelector(".site").getBoundingClientRect().bottom)
  }, location.origin);
  new ResizeObserver(report).observe(document.querySelector(".site"));
  addEventListener("load", report);
  report();
})();`;
  document.body.append(script);
  const html = "<!doctype html>\n" + document.documentElement.outerHTML;
  await fs.writeFile(path.join(outputDir, manualPath, "cover.html"), html);
  return { html, assetBytes };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await buildNeilManualCover(path.join(projectRoot, "client/public"), path.join(projectRoot, "dist/public"));
  console.log(`Staged original Neil cover (${Buffer.byteLength(result.html)} HTML bytes; ${result.assetBytes} image bytes)`);
}
