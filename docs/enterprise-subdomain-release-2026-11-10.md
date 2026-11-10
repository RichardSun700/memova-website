# Enterprise subdomain release

User approved publication to `https://enterprise.memova.ai` on 2026-11-10. This supersedes the earlier local-only scope for this site. The 2C website remains outside this release.

## Isolation contract

- Repository: RichardSun700/memova-website. Enterprise source branch: `codex/enterprise-services-preview`.
- Separate entry: `enterprise-site/index.html`; separate build: `node scripts/build-enterprise.mjs`; output: `dist/enterprise`.
- Separate Cloudflare Pages project: `memova-enterprise`. Never upload this output to project `memova`.
- Enterprise header/footer contain only section links and enterprise contact email. Logo stays at the enterprise home. No consumer app download, login, registration or implicit main-site navigation.
- No AuthProvider, personal-account API, GA, consumer routing, or shared homepage bootstrap in the standalone entry.
- Only brand/font/institution assets are copied. Consumer demo pages are not included. English source content is rendered into HTML; Chinese is available via the language control and `?lang=zh`.
- Canonical, sitemap and robots target only `enterprise.memova.ai`. Unknown paths receive a dedicated noindex 404, not a consumer-home redirect.

## Release process

1. Fetch main and verify the enterprise branch ancestry. Review diff, preserve unrelated worktree changes.
2. Run TypeScript, focused enterprise tests, dependency audit, standalone build, `node scripts/verify-enterprise.mjs`, and desktop/mobile browser checks.
3. Commit and push the enterprise files to GitHub before deployment; verify the remote commit matches the local commit.
4. Build from the pushed commit and verify the release manifest. Authenticate the approved Cloudflare account `b02aa028ef87c390b275f53c3c83407f`.
5. Create/use the dedicated `memova-enterprise` Pages project. This release uses direct upload, not automatic Git integration; `codex/enterprise-services-preview` is the GitHub source branch. Upload only `dist/enterprise`.
6. Associate `enterprise.memova.ai` with that project, then configure only that subdomain's CNAME. Never alter apex/www, MX, main-site custom domains, or existing Workers routes.
7. Read back the live release manifest, HTTPS/canonical and asset responses; confirm 2C release identity is unchanged.

This is a static marketing site. Contact actions open the visitor's mail client; there is no new backend form or new data collection. Existing university/customer statements originate from the user; public mark rights are not independently verified. The OpenAI symbol/name display is a user-requested composition, not an approved partnership lockup. See component and institution provenance notes.

Vault summary remains pending under the previous stale-host read-only safety boundary. No stale host record is refreshed automatically.

## Status

Published source commit: `6ae31299d102de9eb90814e3e60858f90c7a7d5f`, pushed to GitHub before upload. Built again in a clean detached checkout; the release manifest read back from `https://memova-enterprise.pages.dev/enterprise-release.json` matches this SHA. The published HTML is byte-identical to the clean build.

Cloudflare dashboard reports the dedicated project successfully deployed (38 files), and `enterprise.memova.ai` is Active with SSL enabled. The DNS record is `CNAME enterprise -> memova-enterprise.pages.dev`, proxied, automatic TTL. Public DNS also resolves the hostname. No apex/www/MX/Workers route was modified.

Browser verified Chinese/English content, source-only navigation and no errors on the published Pages address. Local 390px mobile navigation opens, selects an enterprise section, closes and stays in the enterprise site with no overflow. A later 320px live-tab attempt did not apply the viewport to that tab; it is not counted as a passing 320px test.

Main-site HTML SHA-256 before and after this operation was identical: `a6b5c44e759da868222572b55b6794c01e387ec0a3a2d10784812be753685f4b`.

Remaining access-verification gap: requests to the new custom hostname from this machine timed out while Cloudflare already showed Active/SSL enabled. Do not claim a successful custom-host HTTP response until it is read back. The working published fallback is `https://memova-enterprise.pages.dev/`; no certificate checks or security warnings were bypassed.

Pre-release checks: standalone build and source-rendered HTML boundary check passed; TypeScript passed; 12 enterprise tests passed. Desktop browser confirmed no missing images or horizontal overflow, internal-only header/footer links and working English/Chinese switching.

Repository dependency audit returned 83 existing advisories (1 critical, 20 high, 51 moderate, 11 low). No dependencies changed. The standalone entry imports React, Lucide, Motion and enterprise components only; it does not start Express or import the existing Streamdown/Mermaid/Zod application paths. These existing repository advisories remain open for a separately scoped dependency update; audit is not reported as passing.

Wrangler OAuth is expired. The new broad 29-permission consent was not granted; automatic safety review blocked it. Release uses the user's existing logged-in Cloudflare dashboard session and direct static upload instead, without exporting browser credentials or creating a broad API token.
