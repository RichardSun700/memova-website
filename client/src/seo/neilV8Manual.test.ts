import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const directory = path.resolve("client/public/personal-manual/neil-armstrong");
const html = fs.readFileSync(path.join(directory, "index.html"), "utf8");
const content = JSON.parse(fs.readFileSync(path.join(directory, "neil-v8-content.json"), "utf8"));

describe("Neil's v8 historical manual", () => {
  it("keeps the original evidence scores and Builder pole assignments aligned", () => {
    expect(content.work_archetype.name).toBe("The Builder");
    expect(content.display_dimensions.map(({ selected, score }: { selected: string; score: number }) => [selected, score])).toEqual([
      ["Think it through", 66], ["Map the path", 78], ["Go deeper", 59], ["Understated", 71],
    ]);
    for (const dimension of content.display_dimensions) {
      expect(html.match(new RegExp(`data-score="${dimension.score}"`, "g"))).toHaveLength(2);
      expect(html).toContain(`style="--p:${100 - dimension.score}" data-score="${dimension.score}"`);
      expect(html).toContain(`${dimension.label}: ${dimension.score} toward ${dimension.selected}`);
    }
    expect(html).not.toContain("then find the viable route from live evidence when the vehicle disproves the map");
  });

  it("uses the supplied fixed Builder library in the new Similar Paths section", () => {
    expect(content.similar_paths.people.map(({ name }: { name: string }) => name)).toEqual(["Henry Ford", "Bill Gates", "Batman", "Neil Armstrong"]);
    expect(html.match(/class="similar-person"/g)).toHaveLength(4);
    expect(html.match(/class="similar-role"/g)).toHaveLength(6);
    expect(html.indexOf('id="similar-paths"')).toBeLessThan(html.indexOf('id="operate"'));
    for (const person of content.similar_paths.people) {
      expect(fs.existsSync(path.resolve(directory, person.image))).toBe(true);
    }
  });

  it("removes template sample content and keeps one accessible responsive document", () => {
    for (const stale of ["Yanglu", "The Conductor", "Corgi", "BODY 1", "BODY 2", "ARCHETYPE NAME", "CARD TITLE", "mobileCardSource", "<iframe"]) {
      expect(html).not.toContain(stale);
    }
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(html).toContain("Historical reconstruction · Apollo 11");
    expect(html).toContain('href="./neil_armstrong_evidence_audit.xlsx"');
    expect(html).toContain('href="./evidence.html"');
    expect(html).toContain('id="breed-dialog" aria-labelledby="breed-title"');
    expect(html).toContain('id="artifact-dialog" aria-labelledby="artifact-title"');
  });
});
