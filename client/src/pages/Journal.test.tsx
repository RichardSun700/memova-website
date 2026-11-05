import { renderToStaticMarkup as renderMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { describe, expect, it } from "vitest";

import { journalEntries } from "@/content/journalEntries";
import Journal from "./Journal";
import JournalArticle from "./JournalArticle";

function renderToStaticMarkup(page: ReactNode) {
  return renderMarkup(<AuthProvider>{page}</AuthProvider>);
}

describe("Memova Journal", () => {
  it("keeps the full homepage navigation on both the index and article pages", () => {
    for (const page of [
      <Journal />,
      <JournalArticle slug="why-we-changed-our-onboarding-story" />,
    ]) {
      const html = renderToStaticMarkup(page);
      const navigation =
        html.match(
          /<nav[^>]*aria-label="Primary navigation"[\s\S]*?<\/nav>/
        )?.[0] ?? "";
      for (const href of [
        "/#experience",
        "/#privacy",
        "/#pro",
        "/journal/",
        "/mcp/",
      ]) {
        expect(navigation).toContain(`href="${href}"`);
      }
      expect(navigation).not.toMatch(/<a\b[^>]*>Product<\/a>/);
      expect(navigation).toContain('aria-current="page">Blog');
      expect(navigation).toContain('class="memova-download-button"');
      expect(navigation).toContain("Join Community");
      expect(navigation).toContain("Sign in");
      expect(html).not.toContain("Join Early Access");
      expect(html).toContain('aria-controls="site-navigation"');
    }
  });
  it("waits for new articles without showing old entries or empty category controls", () => {
    const html = renderToStaticMarkup(<Journal />);

    expect(journalEntries).toHaveLength(0);
    expect(html).toMatch(/<h1\b[^>]*id="memova-journal-heading"[^>]*>Blog<\/h1>/);
    expect(html.match(/New stories are on the way\./g)).toHaveLength(1);
    expect(html).not.toContain('aria-label="Filter journal notes"');
    expect(html).not.toContain("memova-journal-entry-copy");
    expect(html).not.toContain("memova-journal-author-row");
    expect(html).not.toContain("Why we changed our onboarding story.");
    expect(html).not.toContain("The Architecture of Sleep.");
    expect(html).not.toContain("Silva · Product");
    expect(html).not.toContain("Ada · Operations");
    expect(html).not.toContain("/demo/The_Architecture_of_Sleep/");
    expect(html).not.toContain("More notes are being prepared.");
    expect(html).not.toContain("data-product-journal");
    expect(html).toContain('href="/#experience"');
    expect(html).toContain('href="/#privacy"');
    expect(html).toContain('href="/#pro"');
    expect(html).not.toContain('href="/#act"');
    expect(html).not.toContain('href="/product-demo/"');
    expect(html).not.toContain('href="/#product"');
    expect(html).not.toContain('href="/#use-cases"');
    expect(html).not.toContain('href="/#trust"');
    expect(html).toContain('href="/#top"');
  });

  it("does not expose retired article bodies at their former slugs", () => {
    for (const slug of [
      "why-we-changed-our-onboarding-story",
      "the-architecture-of-sleep",
    ]) {
      const html = renderToStaticMarkup(<JournalArticle slug={slug} />);

      expect(html).toContain("Article not found.");
      expect(html).toContain("Back to Blog");
      expect(html).not.toContain("The problem was not a missing tour.");
      expect(html).not.toContain("What we are testing next.");
      expect(html).not.toContain("The Architecture of Sleep.");
      expect(html).not.toContain("Published note");
      expect(html).not.toContain("Silva · Product");
      expect(html).not.toContain("Ada · Operations");
    }
  });
});
