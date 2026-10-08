import fs from "node:fs";
import path from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(path.resolve("client/homepage/index.html"), "utf8");
const helper = source.slice(source.indexOf("function separateMobileOrbitCards("), source.indexOf("function HomepageKnowledgeHero()"));
const separate = runInNewContext(`${helper}; separateMobileOrbitCards`);
const constants = source.slice(source.indexOf("const ORBIT_TRACKS"), source.indexOf("const clampProgress"));
const trajectory = source.slice(source.indexOf("    const rawOrbitPositions ="), source.indexOf("    const orbitPositions ="));
const orbit = runInNewContext(`${constants}; (orbitTravel, snapToWiki) => {
  const compact = true;
  ${trajectory}
  return rawOrbitPositions;
}`);
const ease = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const range = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));

describe("mobile hero motion", () => {
  for (const bounds of [
    { width: 280, height: 184, cardWidth: 96, cardHeight: 36 },
    { width: 335, height: 184, cardWidth: 105, cardHeight: 36 },
    { width: 335, height: 267, cardWidth: 105, cardHeight: 36 },
    { width: 350, height: 439, cardWidth: 109, cardHeight: 36 },
    { width: 390, height: 519, cardWidth: 116, cardHeight: 36 },
  ]) {
    it(`keeps moving cards apart and inside a ${bounds.width}×${bounds.height} field`, () => {
      let first;
      let motion = 0;
      for (let frame = 0; frame <= 100; frame++) {
        const progress = frame / 400;
        const snap = ease(range(progress, .13, .285));
        const scale = 1 - snap * .34;
        const result = separate(orbit(ease(range(progress, .005, .18)), snap), bounds, scale);
        const width = (bounds.cardWidth + 4) * scale + 2;
        const height = (bounds.cardHeight + 6) * scale + 2;
        first ??= result;
        for (let i = 0; i < result.length; i++) {
          const x = result[i].x * bounds.width / 100;
          const y = result[i].y * bounds.height / 100;
          expect(x).toBeGreaterThanOrEqual(width / 2 - .05);
          expect(x).toBeLessThanOrEqual(bounds.width - width / 2 + .05);
          expect(y).toBeGreaterThanOrEqual(height / 2 - .05);
          expect(y).toBeLessThanOrEqual(bounds.height - height / 2 + .05);
          motion = Math.max(motion, Math.abs(result[i].x - first[i].x), Math.abs(result[i].y - first[i].y));
          for (let j = i + 1; j < result.length; j++) {
            const dx = Math.abs(result[i].x - result[j].x) * bounds.width / 100;
            const dy = Math.abs(result[i].y - result[j].y) * bounds.height / 100;
            expect(dx >= width - .05 || dy >= height - .05).toBe(true);
          }
        }
      }
      expect(motion).toBeGreaterThan(3);
    });
  }
});
