import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parseHTML } from "linkedom";
import { describe, expect, it } from "vitest";
import { EnterpriseHeader, EnterpriseFooter } from "./EnterpriseShell";

describe("enterprise site boundary", () => {
  it.each([true, false])(
    "keeps the brand, navigation and footer inside the enterprise site: %s",
    zh => {
      for (const Component of [EnterpriseHeader, EnterpriseFooter]) {
        const { document } = parseHTML(
          renderToStaticMarkup(
            createElement(Component, { zh, contact: "mailto:hello@memova.ai" })
          )
        );
        const links = Array.from(document.querySelectorAll("a"));
        expect(links.length).toBeGreaterThan(3);
        links.forEach(link =>
          expect(link.getAttribute("href")).toMatch(/^(#|mailto:)/)
        );
        expect(document.querySelector('a[href="#top"]')).toBeTruthy();
        expect(
          document.querySelector(
            'a[href*="login"],a[href*="apps.apple"],a[href*="waitlist"]'
          )
        ).toBeNull();
      }
    }
  );
});
