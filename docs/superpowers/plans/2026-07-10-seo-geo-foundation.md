# Memova SEO/GEO Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a crawlable, US-first SEO/GEO foundation that converts public search traffic into Memova iOS early-access users.

**Architecture:** Keep the current Vite React app, add a typed route registry shared by client metadata and a build-time static snapshot generator, and enumerate legitimate SPA routes instead of rewriting every URL. Add focused public React pages and use the existing waitlist until App Store identifiers are available.

**Tech Stack:** React 19, TypeScript 5.6, Vite 7, Wouter, Vitest, Cloudflare Pages static assets.

## Global Constraints

- Use English at the root for P0 US acquisition.
- Use the brand idea `Your everyday context, ready for agents.`
- Describe the flow as everyday context to agent memory to useful workflow outcomes to user approval.
- Never imply passive capture without user choice or silent high-impact execution.
- Do not publish or change remote Cloudflare state in this plan.
- Preserve the user's untracked files in the main checkout.

---

### Task 1: SEO Route Registry and Metadata Contract

**Files:**
- Create: `client/src/seo/sitePages.ts`
- Create: `client/src/seo/sitePages.test.ts`
- Create: `client/src/seo/SiteMetadata.tsx`
- Modify: `client/src/App.tsx`

**Interfaces:**
- Produces: `SITE_URL`, `SitePage`, `sitePages`, `getSitePage(pathname)`, and `SiteMetadata`.
- `SitePage` contains `path`, `title`, `description`, `index`, `changeFrequency`, `priority`, `summary`, and optional `schemaType`.

- [ ] Write tests that require unique titles/descriptions, self-canonical public paths, private-route noindex behavior, and all sitemap pages to have summaries.
- [ ] Run `corepack pnpm exec vitest run client/src/seo/sitePages.test.ts` and verify failure because the registry does not exist.
- [ ] Implement the typed registry and route-aware metadata component; mount `SiteMetadata` once inside `App`.
- [ ] Run the focused test and `corepack pnpm run check`; expect zero failures.
- [ ] Commit with `feat: add route-aware SEO metadata`.

### Task 2: Build-Time Crawlable HTML, Robots, Sitemap, and Route Policy

**Files:**
- Create: `scripts/generate-seo-pages.mjs`
- Create: `scripts/generate-seo-pages.test.ts`
- Create: `client/public/_headers`
- Modify: `client/public/_redirects`
- Modify: `package.json`

**Interfaces:**
- Consumes: serialized page data exported from `client/src/seo/sitePages.ts` via a build step.
- Produces: path-specific `dist/public/**/index.html`, `dist/public/robots.txt`, and `dist/public/sitemap.xml`.
- Exports from the generator: `renderPageHtml(template, page)`, `renderRobots()`, and `renderSitemap(pages)`.

- [ ] Write tests for canonical tags, description/OG/JSON-LD injection, actual XML sitemap output, crawler-specific robots rules, and absence of a catch-all rewrite.
- [ ] Run `corepack pnpm exec vitest run scripts/generate-seo-pages.test.ts`; verify expected failure.
- [ ] Implement the generator, wire it after `vite build`, add noindex headers, and enumerate legitimate SPA routes.
- [ ] Run the focused test, build, then inspect `/robots.txt`, `/sitemap.xml`, `/agent-memory/index.html`, and an unknown URL through `vite preview`.
- [ ] Commit with `feat: generate crawlable marketing pages`.

### Task 3: Acquisition and Authority Pages

**Files:**
- Create: `client/src/components/marketing/MarketingPage.tsx`
- Create: `client/src/pages/IOS.tsx`
- Create: `client/src/pages/AgentMemory.tsx`
- Create: `client/src/pages/HowItWorks.tsx`
- Create: `client/src/pages/UseCaseDetail.tsx`
- Create: `client/src/pages/marketingPages.test.tsx`
- Modify: `client/src/App.tsx`
- Modify: `client/src/components/sections/HeroSection.tsx`

**Interfaces:**
- Produces: public routes `/ios`, `/agent-memory`, `/how-it-works`, and three `/use-cases/:slug` pages.
- All primary CTAs use `/#waitlist` and `Join iOS Early Access` until App Store data is supplied.

- [ ] Write tests that render each page and assert its H1, context-memory-workflow explanation, consent language, and iOS CTA.
- [ ] Run the focused tests and verify they fail because the pages do not exist.
- [ ] Implement the shared marketing layout, pages, routes, and homepage hero copy.
- [ ] Run focused tests, typecheck, and build; expect zero failures.
- [ ] Commit with `feat: add iOS acquisition and agent memory pages`.

### Task 4: End-to-End SEO Verification and Durable Documentation

**Files:**
- Create: `scripts/verify-seo-build.mjs`
- Modify: `package.json`
- Update: `docs/superpowers/specs/2026-07-10-seo-geo-foundation-design.md`

**Interfaces:**
- Produces: `pnpm run check:seo`, a deterministic validation of every public built route and indexing artifact.

- [ ] Write the verification script to reject missing files, duplicate titles, mismatched canonicals, empty static main content, invalid sitemap/robots content, and accidental indexing of private routes.
- [ ] Run it before wiring the build and verify it fails against the incomplete output.
- [ ] Add the script, regenerate the build, and make `check:seo` pass.
- [ ] Run `corepack pnpm exec vitest run`, `corepack pnpm run check`, `corepack pnpm run build`, and `corepack pnpm run check:seo`.
- [ ] Review `git diff --check` and the complete diff, then commit with `test: verify SEO build artifacts`.

