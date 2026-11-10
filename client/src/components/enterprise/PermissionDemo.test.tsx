import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parseHTML } from "linkedom";
import { describe, expect, it } from "vitest";
import {
  demoSources,
  permittedSources,
  PermissionDemo,
} from "./PermissionDemo";

describe("enterprise permission illustration", () => {
  it("only includes role-scoped sample sources", () => {
    expect(permittedSources("sales").map(source => source.id)).toEqual([
      "brief",
      "commercial",
    ]);
    expect(permittedSources("engineering").map(source => source.id)).toEqual([
      "brief",
      "technical",
    ]);
    expect(permittedSources("lead")).toHaveLength(demoSources.length);
    expect(permittedSources("unknown")).toEqual([]);
  });

  it.each([false, true])(
    "keeps initial citations inside the selected role in both languages: %s",
    zh => {
      const { document } = parseHTML(
        renderToStaticMarkup(createElement(PermissionDemo, { zh }))
      );
      const roles = document.querySelectorAll(".ent-segmented button");
      expect(roles).toHaveLength(3);
      expect(roles[0].getAttribute("aria-pressed")).toBe("true");
      expect(document.querySelectorAll('[data-allowed="false"]')).toHaveLength(
        1
      );
      expect(
        document.querySelector(".ent-citations")?.textContent
      ).not.toContain(zh ? "技术架构记录" : "Technical architecture");
      expect(
        document.querySelector(".ent-demo-answer")?.getAttribute("aria-live")
      ).toBe("polite");
      expect(
        document.querySelector("select")?.querySelectorAll("option")
      ).toHaveLength(2);
      expect(document.querySelector(".ent-demo-label")?.textContent).toBe(
        zh ? "合成演示" : "SYNTHETIC DEMO"
      );
    }
  );
});
