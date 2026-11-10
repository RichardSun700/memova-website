# Enterprise contact release and SEO handoff

## Source and release boundaries

The consumer site and enterprise site have distinct release targets. Do not deploy an enterprise checkout with the consumer production script or upload `dist/enterprise` to project `memova`.

| Target | GitHub source | Pages project | Build output |
| --- | --- | --- | --- |
| `memova.ai` and `www.memova.ai` | `main` | `memova` | `dist/public` |
| `enterprise.memova.ai` | `codex/enterprise-services-preview` | `memova-enterprise` | `dist/enterprise` |

The dedicated enterprise source branch is intentional and is not merged into consumer `main` by this release. Cloudflare's direct-upload Production environment uses its own `main` label; that label is not proof of a GitHub `main` build. Read `/enterprise-release.json` and compare its commit with the exact pushed enterprise source.

Verified GitHub heads before this update: consumer `main` is `053f3c9924ee15373d8c78888659a8cb701b09a6`; enterprise branch is `d4c9e0eb5e3b2b39b78e43df36a35fdaa5a92bc0`. The functional contact release was published from `e16a9a35f0d15edcf42a7c24d19a6a2f1e2f4702`, followed by the documentation-only `d4c9e0e` commit.

## Previous SEO policy checked

- Repository design: `docs/superpowers/specs/2026-07-10-seo-geo-foundation-design.md`.
- Active consumer implementation: `client/src/seo/sitePages.ts`, `scripts/generate-seo-pages.mjs`, and `client/src/seo/SiteMetadata.tsx`.
- Historical vault SEO handoff dated July 10, updated July 17: static readable HTML, unique page metadata/canonical/JSON-LD, OAI-SearchBot and PerplexityBot discovery allowed, GPTBot training crawl opted out, private and hidden demo routes noindexed, real 404s.
- Historical July 30 deployment tutorial describes a composed preview-branch consumer release. It is historical, not permission to bypass the later GitHub-main production boundary.

## Enterprise SEO corrections

The contact page had the correct canonical but inherited the home page's description and Open Graph URL/title. The standalone build now sets route-specific title, description, canonical and Open Graph metadata through a DOM parser. Each route includes matching WebPage or ContactPage JSON-LD without unsupported certification, customer or service-performance claims.

The enterprise robots file now explicitly preserves the existing discovery/training distinction: public search crawling is allowed, OAI-SearchBot and PerplexityBot are explicitly allowed, GPTBot is disallowed, and `/api/` is excluded from crawling. Robots is a crawler request, not authentication or a guarantee that third parties will comply.

The enterprise sitemap contains only `https://enterprise.memova.ai/` and `https://enterprise.memova.ai/contact`. Canonicals stay on this host, including when the language query is present. Do not add an obsolete consumer `/enterprise` route or private lead/API URLs to the consumer registry or sitemap. Unknown enterprise routes retain their noindex 404.

The consumer robots/sitemap, hidden direct-link pages, MCP/account routing and GA4 consent implementation are unchanged. No GA4 bootstrap, tracking event, Search Console verification or search-engine submission is added to the enterprise site. Analytics and any additional consent/privacy wording need a separate scoped decision.

## Release checks

1. Fetch and inspect the current enterprise source. Use a clean checkout; preserve other worktrees' unrelated edits.
2. Run `corepack pnpm run check`, enterprise React tests, `node scripts/build-enterprise.mjs` and `node scripts/verify-enterprise.mjs`. The verifier now checks unique route metadata, JSON-LD, sitemap URLs and crawler groups in addition to isolation and contact routing.
3. Run the dependency audit. On November 10 it reports 83 existing advisories: 1 critical, 20 high, 51 moderate and 11 low. This metadata change does not modify dependencies or the lockfile; do not describe the audit as passed.
4. Inspect `git diff`, commit and push to `codex/enterprise-services-preview`. Verify the remote SHA before deploying. Stop the local preview before rebuilding the final artifact; rebuild from the clean pushed commit so the manifest contains that SHA.
5. Upload only the standalone enterprise build to `memova-enterprise`. Preserve the existing `CONTACT_API` service binding and the API-only `_worker.js`/`_routes.json`. Do not deploy the backend or change D1, DNS, MX, consumer assets or account permissions for a metadata correction.
6. Read back the live manifest, home/contact metadata, sitemap, robots and contact API response. Record the actual deployed commit and URL separately; a GitHub push alone is not a deployment.

## Company knowledge synchronization

Canonical team entry: [Memova knowledge base / Development / Website source and deployment](https://chatgpt.com/space/page_6effcc9c7fb481918a9cada6c72f1cd4). Keep the consumer-main rule and add the dedicated enterprise exception there rather than overwriting the consumer instructions.

Detailed contact backend operations and verification: `docs/enterprise-contact-operations-2026-11-10.md`. This includes the dedicated Worker/D1, the notification outbox and the synthetic test result. Service acceptance of an email is not independently observed inbox receipt.

The paired iCloud vault check on November 10 returned zero errors and ten warnings, including a primary-host profile that is 66 days old. Preserve the read-only boundary; queue a concise V3 summary locally until host ownership is safely revalidated. Never publish credentials or customer inquiry records in documentation.

## Published verification

- Source commit `e7da57c49f24ac23764881fcc722382a7cbcb435` was pushed and verified against the GitHub enterprise branch before the final clean rebuild and upload.
- Pages deployment `d93a7d5c-4ef4-4209-95bd-25aac00ed98e`, snapshot `https://d93a7d5c.memova-enterprise.pages.dev/`, is Production on project `memova-enterprise`.
- `https://enterprise.memova.ai/enterprise-release.json` returns that source commit. The live contact DOM has its own canonical, description, Open Graph URL and ContactPage JSON-LD. The live robots file contains the intended discovery groups and GPTBot opt-out.
- `GET /api/contact` returns the expected HTTP 405 JSON from the dedicated contact backend, not a missing-service-binding error. This metadata-only release did not create another lead or send a notification.
- The 2C homepage SHA-256 is unchanged: `a6b5c44e759da868222572b55b6794c01e387ec0a3a2d10784812be753685f4b` before the contact work and after this SEO release.
- The existing company Space page linked above was updated and read back: consumer release history retained, enterprise source/project/commit/deployment recorded, and crawler/privacy/release boundaries included. No new duplicate knowledge-base page was created. Saved text and structure were checked through the connector; the Space visual layout was not browser-reviewed.
- This verification section is a documentation-only follow-up. Its GitHub commit may be newer than the live source manifest; do not redeploy consumer main or roll back enterprise production merely to make a documentation-only branch head match the manifest.
