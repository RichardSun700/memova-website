# GA4 Consent-Safe Deployment Design

## Goal

Turn PR #3 from a raw GA4 snippet into a production-safe measurement layer for Memova's US-first iOS acquisition funnel, while preserving the existing SEO/GEO static-page build and Cloudflare Pages deployment contract.

## Decisions

- Keep GA4 measurement ID `G-9YJQ994J98`.
- Load one shared first-party bootstrap, `/analytics/ga4-consent.js`, instead of copying the Google snippet into every HTML document.
- Use Google Consent Mode v2. Advertising storage, advertising user data, and ad personalization remain denied everywhere.
- Analytics storage defaults to denied for the EEA, United Kingdom, and Switzerland and granted elsewhere. A compact global privacy-choice surface allows accept, reject, and later withdrawal.
- Store the visitor's explicit analytics choice in local storage. Do not store product content or identifiers in this preference.
- Disable automatic `page_view` in `gtag('config')`. Standalone documents emit one page view; the React SPA emits one page view after route metadata updates, preventing duplicate or missing History API views.
- Measure the current acquisition funnel with `ios_early_access_click` and `waitlist_submit_success`. Do not invent App Store events before an App Store link exists.
- Keep hidden/noindex HTML pages measurable only through the same consent-aware bootstrap; no page receives an exception to the consent policy.
- Update the privacy policy with the analytics provider, purpose, data categories, consent control, and withdrawal mechanism.
- Make clean-checkout verification deterministic: typecheck, build, tests, and SEO gate in that order. Add the same order to GitHub Actions.
- Cloudflare remains Direct Upload. Production must be built from the merged, clean `main` commit and verified on both the immutable Pages URL and `memova.ai`.

## Components

### Shared browser bootstrap

`client/public/analytics/ga4-consent.js` owns Consent Mode defaults, preference persistence, Google tag loading, the global privacy-choice UI, standalone page views, and a small `window.memovaAnalytics` API.

### React bridge

`client/src/analytics/AnalyticsTracker.tsx` observes Wouter locations and emits SPA page views after route metadata updates. `client/src/analytics/events.ts` provides a typed wrapper for conversion events used by React components.

### Acquisition instrumentation

Existing iOS early-access links receive `data-analytics-event="ios_early_access_click"`. The waitlist form emits `waitlist_submit_success` only after the API returns success.

### Verification and delivery

Generator and build tests assert one consent-aware bootstrap per HTML document, denied advertising consent, manual page-view mode, and privacy-policy disclosure. CI and the production deploy script use the same build-first order.

## Failure Boundaries

- If Google Tag Manager is blocked, the site remains fully functional.
- If local storage is unavailable, consent choices apply for the current page only and the choice surface reappears later.
- Analytics failures never block navigation or waitlist submission.
- No deployment occurs if typecheck, build, tests, SEO verification, clean-source verification, GitHub synchronization, or Cloudflare authentication fails.

## Production Acceptance

- PR branch and merged `main` pass typecheck, build, all tests, SEO verification, and source verification.
- Every built HTML document contains exactly one shared analytics bootstrap and no copied inline GA4 configuration.
- Production public SEO routes remain 200 with correct titles; unknown paths remain real noindex 404 responses.
- `robots.txt`, `sitemap.xml`, and private-route noindex headers remain correct.
- The production HTML references the consent-aware bootstrap and contains the updated privacy disclosure.

