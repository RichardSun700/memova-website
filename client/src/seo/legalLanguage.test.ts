import { describe, expect, it } from "vitest";
import { withLegalLanguage } from "./legalLanguage";

describe("legal document links", () => {
  it.each([
    "/privacy",
    "https://memova.ai/privacy",
    "//memova.ai/privacy",
  ])("keeps the authored site link %s on the current origin", href => {
    const result = withLegalLanguage(href, "zh");
    expect(result).toBe("/privacy?lang=zh");
    expect(new URL(result, "http://localhost:4173").origin).toBe("http://localhost:4173");
  });

  it("retains the destination query and fragment while updating language", () => {
    expect(withLegalLanguage("https://memova.ai/privacy?source=terms&lang=en#health", "zh"))
      .toBe("/privacy?source=terms&lang=zh#health");
  });

  it.each([
    "https://apps.apple.com/us/app/memova-ai/id6796284954",
    "https://api.memova.ai/mcp",
    "https://discord.gg/E9u5FFvhdu",
    "https://memova.ai.example.com/privacy",
    "mailto:hello@memova.ai",
    "#health",
  ])("preserves external or in-page destination %s", href => {
    expect(withLegalLanguage(href, "zh")).toBe(href);
  });
});
