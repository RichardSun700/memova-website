import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parseHTML } from "linkedom";
import { describe, expect, it } from "vitest";
import { InstitutionBanner, institutions } from "./InstitutionBanner";

describe("enterprise institution banner", () => {
  it.each([false, true])(
    "renders supplied institutions once for assistive technology: %s",
    zh => {
      const { document } = parseHTML(
        renderToStaticMarkup(createElement(InstitutionBanner, { zh }))
      );
      const groups = document.querySelectorAll(".ent-logo-group");
      expect(groups).toHaveLength(2);
      expect(groups[0].hasAttribute("aria-hidden")).toBe(false);
      expect(groups[1].getAttribute("aria-hidden")).toBe("true");
      expect(
        Array.from(groups[0].querySelectorAll("img")).map(image =>
          image.getAttribute("alt")
        )
      ).toEqual(institutions.map(institution => institution.name));
      expect(
        Array.from(groups[1].querySelectorAll("img")).every(
          image => image.getAttribute("alt") === ""
        )
      ).toBe(true);
      expect(document.querySelector("button")).toBeNull();
      expect(document.querySelector(".ent-institution-heading")).toBeNull();
      expect(
        document.querySelectorAll(".ent-institution-logo small")
      ).toHaveLength(0);
      expect(document.querySelector("#ent-institution-heading")).toBeNull();
      expect(
        document.querySelector("section")?.getAttribute("aria-label")
      ).toBe(zh ? "机构与技术品牌标识" : "Institution and technology logos");
    }
  );

  it("keeps the requested six logos without Zhejiang or visible relationship claims", () => {
    const { document } = parseHTML(
      renderToStaticMarkup(createElement(InstitutionBanner, { zh: true }))
    );
    const original = document.querySelector(
      ".ent-logo-group:not([aria-hidden])"
    )!;
    expect(institutions.map(item => item.id)).toEqual([
      "stanford",
      "berkeley",
      "azure",
      "aws",
      "openai",
      "alibaba",
    ]);
    expect(original.querySelector(".ent-logo-zju")).toBeNull();
    expect(
      original.querySelector(".ent-logo-stanford img")?.getAttribute("src")
    ).toContain("stanford-seal-wordmark");
    expect(
      original.querySelector(".ent-logo-openai img")?.getAttribute("src")
    ).toBe("/enterprise/institutions/openai-blossom.svg");
    expect(institutions.find(item => item.id === "openai")).toMatchObject({
      width: 411,
      height: 411,
    });
    expect(
      original.querySelector(".ent-logo-openai .ent-provider-name")?.textContent
    ).toBe("OpenAI");
    expect(original.textContent).not.toMatch(
      /用户来源|云服务生态|合作伙伴|客户/
    );
  });

  it("uses local, unchanged-aspect-ratio assets rather than external hotlinks", () => {
    for (const institution of institutions) {
      expect(institution.src.startsWith("/enterprise/institutions/")).toBe(
        true
      );
      expect(
        fs.existsSync(
          path.resolve(
            import.meta.dirname,
            "../../../public",
            `.${institution.src}`
          )
        )
      ).toBe(true);
      expect(institution.width).toBeGreaterThan(0);
      expect(institution.height).toBeGreaterThan(0);
    }
  });
});
