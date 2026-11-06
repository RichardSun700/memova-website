import { renderToStaticMarkup as renderMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { describe, expect, it } from "vitest";
import { parseHTML } from "linkedom";

import { journalEntries } from "@/content/journalEntries";
import Journal from "./Journal";
import JournalArticle from "./JournalArticle";

function renderToStaticMarkup(page: ReactNode) {
  return renderMarkup(<AuthProvider>{page}</AuthProvider>);
}

describe("Memova Journal", () => {
  it("keeps authored website links inside this deployment while leaving source links external", () => {
    const { document } = parseHTML(renderToStaticMarkup(<JournalArticle slug="rewind-on-an-older-apple-watch" />));
    const article = document.querySelector("article")!;
    expect(article.querySelector('a[href^="https://memova.ai"]')).toBeNull();
    for (const href of ["/", "/support/", "/privacy/"]) {
      const link = article.querySelector(`a[href="${href}"]`)!;
      expect(link).not.toBeNull();
      expect(link.hasAttribute("target")).toBe(false);
      expect(new URL(href, "http://localhost:4177/journal/rewind-on-an-older-apple-watch/").origin).toBe("http://localhost:4177");
    }
    expect(article.querySelector('a[href^="https://support.apple.com/"]')?.getAttribute("target")).toBe("_blank");
  });
  it("keeps the full homepage navigation on both the index and article pages", () => {
    for (const page of [
      <Journal />,
      <JournalArticle slug="rewind-on-an-older-apple-watch" />,
    ]) {
      const html = renderToStaticMarkup(page);
      const navigation =
        html.match(
          /<header[^>]*class="site-header memova-watch-header"[\s\S]*?<\/header>/
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
      expect(navigation).toContain('class="mw-control mw-download"');
      expect(navigation).toContain("Join the community");
      expect(navigation).toContain("Sign in");
      expect(html).not.toContain("Join Early Access");
      expect(html).toContain('aria-controls="mobile-navigation"');
    }
  });
  it("lists Avery’s Rewind preview without restoring retired entries", () => {
    const html = renderToStaticMarkup(<Journal />);

    expect(journalEntries).toHaveLength(2);
    expect(html).toMatch(/<h1\b[^>]*id="memova-journal-heading"[^>]*>Blog<\/h1>/);
    expect(html).not.toContain("New stories are on the way.");
    expect(html).toContain('aria-label="Filter journal notes"');
    expect(html).toMatch(/href="\/journal\/rewind-on-an-older-apple-watch\/?"/);
    expect(html).toContain("How to Get Rewind Features on an Older Apple Watch");
    expect(html).toContain("Avery · GTM at Memova");
    expect(html).toContain('src="/journal/avery.jpg"');
    expect(html).toContain('src="/journal/rewind/04-conversation.webp"');
    expect(html).toContain("6 min read");
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

  it("lists Ada’s Recap article and preserves its authored structure", () => {
    const slug = "apple-watch-live-rewind-siri-recap";
    const { document: index } = parseHTML(renderToStaticMarkup(<Journal />));
    const card = index.querySelector(`.memova-journal-entry > a[href="/journal/${slug}/"]`);
    expect(card?.textContent).toContain("Ada · GTM");
    expect(card?.querySelector('img[src="/journal/ada.jpg"]')).not.toBeNull();

    const { document } = parseHTML(renderToStaticMarkup(<JournalArticle slug={slug} />));
    const article = document.querySelector("article")!;
    expect(article.querySelector("h1")?.textContent).toContain("A Summary Is Only the Beginning");
    expect(article.querySelector("time")?.outerHTML).toMatch(/datetime="2026-11-05"/i);
    expect(article.querySelectorAll("nav[aria-label='On this page'] a")).toHaveLength(7);
    expect(article.querySelectorAll("section ol li")).toHaveLength(5);
    expect(article.querySelectorAll("figure figcaption")).toHaveLength(4);
    expect(article.querySelector('figure img[width="2000"][height="1250"]')).not.toBeNull();
    expect(article.querySelector('a[href="/journal/rewind-on-an-older-apple-watch/"]')).not.toBeNull();
    expect(article.textContent).not.toContain("SEO / GEO Metadata");
  });

  it("renders the reviewed tutorial, author, images, and FAQ at its independent route", () => {
    const html = renderToStaticMarkup(
      <JournalArticle slug="rewind-on-an-older-apple-watch" />
    );

    expect(html).toContain("How to Get Rewind Features on an Older Apple Watch");
    expect(html).toContain("Coming soon · Memova Pro");
    expect(html).toMatch(/<strong\b[^>]*>Avery<\/strong>/);
    expect(html).toContain("GTM at Memova");
    expect(html).toContain('src="/journal/avery.jpg"');
    expect(html).not.toContain("<time");
    expect(html).toContain('aria-label="On this page"');
    expect(html).toContain('href="#planned-workflow"');
    expect(html).toContain("How Memova Rewind Is Being Designed");
    const images = [
      "/journal/rewind/01-settings.webp",
      "/journal/rewind/02-window-options.webp",
      "/journal/rewind/03-double-tap-gesture.webp",
      "/journal/rewind/04-conversation.webp",
    ];
    for (const image of images) expect(html).toContain(`src="${image}"`);
    expect(html.indexOf(images[0])).toBeLessThan(html.indexOf(images[1]));
    expect(html.indexOf(images[1])).toBeLessThan(html.indexOf(images[2]));
    expect(html.indexOf(images[2])).toBeLessThan(html.indexOf(images[3]));
    expect(html).not.toContain("03-apple-watch-digital-crown-rewind");
    expect(html).toContain("Enlarge image:");
    expect(html).toContain("Close enlarged image");
    expect(html).toContain('id="faq"');
    expect(html).toContain("Is Memova Rewind available now?");
    expect(html).toContain("Not yet. Rewind is coming soon");
    expect(html).toContain("How will I activate Memova Rewind?");
    expect(html).toContain("Does installing Memova enable Apple Live Rewind?");
    expect(html).toContain('href="https://support.apple.com/en-us/148354"');
    expect(html).toContain('href="https://apps.apple.com/us/app/memova-ai/id6796284954"');
    expect(html).toContain('href="https://discord.com/invite/E9u5FFvhdu"');
    expect(html).not.toContain("**Memova Rewind");
    expect(html).not.toContain("IMAGE 01");
    expect(html).not.toContain("SEO Title");
  });

  it("keeps upcoming controls and compatibility separate from currently available features", () => {
    const html = renderToStaticMarkup(
      <JournalArticle slug="rewind-on-an-older-apple-watch" />
    );

    expect(html).toContain("Bring your index finger and thumb together twice to open Memova Rewind (coming soon) and revisit what was just said.");
    expect(html).not.toMatch(/double[\s-]*(?:press|click)\s+(?:the\s+)?side button/i);
    expect(html).toContain("they do not confirm compatibility for the upcoming Rewind feature");
    expect(html).toContain("What Can You Use in Memova Today?");
    expect(html).toContain("Local transcription and text search can work offline");
    expect(html).not.toContain("The Memova column");
    expect(html).not.toContain("App Performance");
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
