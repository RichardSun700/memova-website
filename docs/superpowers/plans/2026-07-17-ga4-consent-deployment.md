# GA4 Consent-Safe Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship consent-aware GA4 measurement, reliable SPA and iOS-funnel events, and deterministic CI/deployment for Memova.

**Architecture:** One shared public bootstrap owns consent and Google tag lifecycle across SPA and standalone HTML. A small React bridge owns SPA route page views and typed funnel events. Build and delivery checks run in a clean-checkout-safe order.

**Tech Stack:** Vite, React 19, TypeScript, Wouter, Vitest, GitHub Actions, Cloudflare Pages, GA4 gtag.js Consent Mode v2.

## Global Constraints

- Measurement ID is exactly `G-9YJQ994J98`.
- Advertising consent remains denied in every region.
- EEA, UK, and Switzerland analytics storage defaults to denied.
- Analytics must never block product behavior.
- No App Store event is added until the real App Store URL exists.
- Production deploys only from verified merged `main`.

---

### Task 1: Shared consent-aware analytics bootstrap

**Files:**
- Create: `client/public/analytics/ga4-consent.js`
- Modify: `client/index.html`
- Modify: `client/public/research-lab/nvidia-2026-gtc/index.html`
- Modify: `client/public/user-cases/demos/*.html`
- Test: `client/src/seo/generateSeoPages.test.ts`

**Interfaces:**
- Produces: `window.memovaAnalytics.trackPageView()` and `window.memovaAnalytics.trackEvent(name, parameters)`.
- Consumes: local storage key `memova.analytics.consent.v1`.

- [ ] Write tests asserting one shared bootstrap, Consent Mode v2 defaults, manual page-view configuration, and no copied inline Google loader.
- [ ] Run the focused test and verify it fails against the raw PR snippet.
- [ ] Implement the shared bootstrap, privacy-choice UI, and HTML includes.
- [ ] Run the focused test and verify it passes.

### Task 2: SPA and acquisition events

**Files:**
- Create: `client/src/analytics/AnalyticsTracker.tsx`
- Create: `client/src/analytics/events.ts`
- Modify: `client/src/App.tsx`
- Modify: `client/src/components/Navbar.tsx`
- Modify: `client/src/components/marketing/MarketingPage.tsx`
- Modify: `client/src/components/sections/HeroSection.tsx`
- Modify: `client/src/components/sections/CTASection.tsx`
- Test: `client/src/pages/marketingPages.test.tsx`

**Interfaces:**
- Consumes: `window.memovaAnalytics` from Task 1.
- Produces: SPA `page_view`, `ios_early_access_click`, and `waitlist_submit_success` events.

- [ ] Add failing tests for tracker placement, CTA event markers, and success-only waitlist tracking.
- [ ] Verify the focused tests fail for missing instrumentation.
- [ ] Implement the React tracker and event wrapper, then instrument the funnel.
- [ ] Verify the focused tests pass.

### Task 3: Privacy disclosure

**Files:**
- Modify: `client/src/content/privacy-policy.md`
- Test: `client/src/pages/marketingPages.test.tsx`

**Interfaces:**
- Documents: Google Analytics provider, measurement purpose, data categories, consent control, and withdrawal.

- [ ] Add a failing policy-content assertion.
- [ ] Verify failure because the GA4 disclosure is absent.
- [ ] Add the analytics and cookies section in plain English.
- [ ] Verify the policy test passes.

### Task 4: Deterministic CI and production deploy order

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `scripts/deploy-production.sh`
- Test: `client/src/seo/verifyProductionSource.test.mjs`

**Interfaces:**
- Produces: check order `check -> build -> test -> check:seo` in CI and production deployment.

- [ ] Add a failing test that inspects deployment command order and CI coverage.
- [ ] Verify the test fails on the existing test-before-build script and missing workflow.
- [ ] Reorder deployment checks and add GitHub Actions verification.
- [ ] Verify the focused test passes.

### Task 5: Full verification, GitHub integration, and Cloudflare deployment

**Files:**
- Verify all modified files.
- Update: PR #3 description and state.

**Interfaces:**
- Consumes: a clean `agent/add-ga4-tracking` branch.
- Produces: merged GitHub `main` and an immutable Cloudflare Pages production deployment.

- [ ] Run `pnpm run check`, `pnpm run build`, `pnpm test`, `pnpm run check:seo`, `node scripts/verify-production-source.mjs`, and `git diff --check`.
- [ ] Confirm every built HTML file contains exactly one shared bootstrap and no duplicate GA loader.
- [ ] Commit and push only scoped files to `agent/add-ga4-tracking`.
- [ ] Update PR #3, mark ready, and merge after GitHub checks pass or after locally reproducing the exact CI commands if checks are pending.
- [ ] Build the merged clean `main`, deploy `dist/public` to Cloudflare Pages project `memova`, and record deployment ID/URL.
- [ ] Verify production route titles, analytics bootstrap, privacy disclosure, robots, sitemap, noindex headers, and real 404 behavior.

