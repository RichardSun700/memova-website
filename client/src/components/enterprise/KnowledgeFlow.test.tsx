import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parseHTML } from "linkedom";
import { describe, expect, it } from "vitest";
import { KnowledgeFlow } from "./KnowledgeFlow";
import { createBeamPath } from "./AnimatedBeam";

describe("enterprise knowledge flow", () => {
  it.each([true, false])(
    "keeps source categories and company ownership clear: %s",
    zh => {
      const { document } = parseHTML(
        renderToStaticMarkup(createElement(KnowledgeFlow, { zh }))
      );
      expect(document.querySelector(".ent-source-file span")?.textContent).toBe(
        zh ? "制度 · 方案 · 业务资料" : "Policies · plans · resources"
      );
      expect(document.documentElement.textContent).not.toMatch(
        /product-brief|v\.04/i
      );
      expect(document.querySelector(".ent-knowledge-node img")).toBeNull();
      expect(
        document.querySelector(".ent-knowledge-icon .lucide-library-big")
      ).not.toBeNull();
      expect(document.querySelector("button")).toBeNull();
      expect(
        document.querySelectorAll(".ent-flow-sources .ent-flow-node")
      ).toHaveLength(3);
      expect(
        document.querySelectorAll(".ent-flow-results .ent-flow-node")
      ).toHaveLength(2);
    }
  );

  it("connects the facing boundaries, not the middle of the text nodes", () => {
    const box = { left: 100, top: 100, width: 1000, height: 400 };
    expect(
      createBeamPath(
        box,
        { left: 100, top: 140, width: 200, height: 80 },
        { left: 500, top: 200, width: 250, height: 200 }
      )
    ).toBe("M200,80 C300,80 300,200 400,200");
    expect(
      createBeamPath(
        box,
        { left: 100, top: 100, width: 100, height: 80 },
        { left: 140, top: 250, width: 240, height: 160 }
      )
    ).toBe("M50,80 C50,115 160,115 160,150");
  });
});
