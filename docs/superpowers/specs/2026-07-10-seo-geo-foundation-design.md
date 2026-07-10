# Memova SEO/GEO Foundation Design

## Goal

Turn `memova.ai` from a single-shell Vite SPA into a crawlable US-first iOS acquisition site whose public pages consistently explain Memova as the intuitive bridge from everyday context to agent memory and useful workflow outcomes.

## P0 Scope

- Keep the existing Vite + React application and visual system for the iOS launch window.
- Add route-specific public pages for `/ios`, `/agent-memory`, `/how-it-works`, and three high-intent use-case detail routes.
- Generate path-specific static HTML snapshots at build time with visible matching copy, metadata, canonical URLs, Open Graph tags, and JSON-LD.
- Generate valid `robots.txt` and `sitemap.xml` and explicitly allow search/citation crawlers while keeping private/account routes out of the index.
- Replace the catch-all SPA rewrite with an allowlist of legitimate application routes so unknown URLs return a real 404.
- Add route-aware client metadata so navigation preserves the same canonical and indexing contract.
- Change the homepage primary message and CTA to US iOS acquisition. Before the App Store ID is supplied, the CTA continues to use the existing early-access form.

## Brand Contract

Primary external idea: **Your everyday context, ready for agents.**

Supporting definition: Memova turns the notes, conversations, and ideas a user chooses to capture into private agent memory and useful workflow outcomes, without requiring the user to organize everything first.

The site must preserve these boundaries:

- The user chooses what to capture.
- Memova prepares context and workflows; users approve consequential actions.
- Health and financial examples are product demonstrations, not professional advice.
- Memova is not positioned as a generic meeting recorder or fully autonomous agent.

## Architecture

`client/src/seo/sitePages.ts` is the single source of truth for public route metadata, crawlability, structured data, sitemap membership, and build-time summaries. The browser uses the registry through `SiteMetadata`; the build uses the same registry through a Node post-build generator. This prevents the browser metadata, static HTML, sitemap, and robots policy from drifting apart.

Public React routes remain interactive. The post-build generator creates route-specific HTML files containing the same visible claims as the React page, so crawlers receive meaningful text without waiting for JavaScript. This is a launch-safe bridge; a later phase can migrate public marketing pages to a native SSG framework without changing URLs.

## Initial Information Architecture

- `/` - acquisition-oriented homepage.
- `/ios` - iOS launch and early-access landing page.
- `/agent-memory` - canonical Memova definition of agent memory.
- `/how-it-works` - capture to memory to workflow to approval.
- `/user-cases` - use-case index.
- `/use-cases/meeting-to-follow-up` - meeting decisions and follow-up.
- `/use-cases/idea-to-product-brief` - founder idea to product brief.
- `/use-cases/conversation-to-action-plan` - important conversation to next steps.
- `/mcp`, `/privacy`, `/terms` - existing public product/legal pages.

Account, consent, settings, hidden demo, and raw demo routes are excluded from indexing.

## Conversion Contract

Until the App Store listing exists, all iOS acquisition CTAs point to `/#waitlist` and use the label `Join iOS Early Access`. Once the user supplies the App Store URL and numeric app ID, the same CTA interface can switch to `Get Memova for iPhone`, add the Apple smart app banner, and retain the waitlist as a secondary fallback.

## Deployment Boundary

This implementation prepares a local branch and Cloudflare Pages-compatible build artifacts. It does not push, deploy, enable Cloudflare Crawler Hints, connect GitHub, or create domain-level redirects without a separate explicit publish action.

