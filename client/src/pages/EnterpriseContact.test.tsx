import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parseHTML } from "linkedom";
import { test, expect } from "vitest";
import EnterpriseContact from "./EnterpriseContact";
test("renders an accessible contact form and email fallback without a mailto-only CTA", () => {
  const { document } = parseHTML(
    renderToStaticMarkup(createElement(EnterpriseContact))
  );
  expect(document.querySelector("form")?.getAttribute("action")).toBe(
    "/api/contact"
  );
  expect(document.querySelector('a[href^="mailto:"]')).toBeNull();
  for (const id of ["contact-name", "contact-email", "contact-message"]) {
    expect(document.querySelector(`#${id}`)?.hasAttribute("required")).toBe(
      true
    );
    expect(document.querySelector(`label[for="${id}"]`)).toBeTruthy();
  }
  expect(
    document.querySelector("#contact-company")?.hasAttribute("required")
  ).toBe(false);
  expect(document.querySelector(".ent-contact-address")?.textContent).toBe(
    "richard@memova.ai"
  );
  expect(document.querySelector('input[name="phone"]')).toBeNull();
});
