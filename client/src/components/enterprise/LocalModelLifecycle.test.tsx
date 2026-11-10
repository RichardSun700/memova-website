import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parseHTML } from "linkedom";
import { describe, expect, it } from "vitest";
import { LocalModelLifecycle, localModelStages } from "./LocalModelLifecycle";

describe("industrial model lifecycle", () => {
  it.each([true, false])(
    "renders an accessible, bilingual five-stage process: %s",
    zh => {
      const stages = localModelStages(zh);
      expect(stages.map(stage => stage.id)).toEqual([
        "collect",
        "prepare",
        "train",
        "deploy",
        "improve",
      ]);
      const { document } = parseHTML(
        renderToStaticMarkup(createElement(LocalModelLifecycle, { zh }))
      );
      const buttons = Array.from(
        document.querySelectorAll(".ent-model-rail button")
      );
      expect(buttons).toHaveLength(5);
      expect(
        buttons.filter(button => button.getAttribute("aria-pressed") === "true")
      ).toHaveLength(1);
      buttons.forEach((button, index) => {
        expect(button.textContent).toContain(stages[index].label);
        expect(button.getAttribute("aria-controls")).toBe(
          "industrial-stage-detail"
        );
      });
      expect(
        document
          .querySelector("#industrial-stage-detail")
          ?.getAttribute("aria-labelledby")
      ).toBe("industrial-collect");
      expect(
        document
          .querySelector(".ent-model-feedback button")
          ?.getAttribute("aria-pressed")
      ).toBe("false");
      expect(
        document.querySelector(".ent-model-safety")?.textContent
      ).toContain(zh ? "安全联锁" : "safety interlocks");
    }
  );

  it("keeps training, inference deployment and reviewed updates distinct", () => {
    const stages = localModelStages(false);
    expect(stages[2].text).toContain("held-out data");
    expect(stages[3].text).toContain("Deploy inference");
    expect(stages[3].text).toContain("rollback");
    expect(stages[4].text).toContain("approve model updates");
    const content = JSON.stringify(stages);
    expect(content).not.toMatch(/waste|incinerat|平湖|黄冈|PSO|RHO/i);
  });
});
