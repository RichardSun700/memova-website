# Enterprise knowledge flow release

Release initiated: 2026-11-11. Published and live verification completed by 2026-11-12. Scope: enterprise frontend only. Consumer main and the contact backend are not release targets.

## Reviewed changes

- Documents now shows category copy, `Policies / plans / resources`, rather than a sample Markdown filename. Chinese uses the matching three-category description.
- The knowledge flow and institution marquee no longer show playback controls. Motion stops offscreen and honors reduced-motion preferences; hover-capable devices can hold it still by hovering.
- Node-edge light trails and moving blue data packets replace the previous single gradient beam. Responsive paths run left-to-right on desktop and top-to-bottom on mobile.
- The company knowledge node uses Lucide LibraryBig rather than a Memova brand mark. Existing header/footer and institution assets are unchanged.
- The two flow labels have transparent backgrounds. SVG masks keep paths away from the text, and label resize observation handles language changes.
- The Industry Perspective description is now the exact approved Chinese copy, with matching English: `Methodological references from public industry practices for Memova's proposed application scenarios.`

## Release boundary

- GitHub source branch: `codex/enterprise-services-preview` in `RichardSun700/memova-website`.
- Target host/project/output: `enterprise.memova.ai` / `memova-enterprise` / `dist/enterprise`.
- Initial remote enterprise head: `319136464b41194f6e7a8c7f6188dbc8f8b7d801`. Initial remote consumer main: `053f3c9924ee15373d8c78888659a8cb701b09a6`.
- Review and push source first, verify the remote SHA, then rebuild from the clean pushed commit. A local preview build is not a production release.
- Preserve `CONTACT_API`, `_worker.js` and the API-only `_routes.json`. Do not change Worker/D1, email, DNS/MX, main-site content, hidden routes, SEO registry or analytics consent.
- Keep the existing enterprise canonical/sitemap, search discovery and GPTBot training opt-out. Verify with `node scripts/verify-enterprise.mjs` after the final build.

## Validation before upload

- TypeScript and 16 enterprise/contact tests pass.
- Local build and enterprise SEO/isolation verifier passed during review; repeat after the source commit is pushed.
- Local browser checks cover desktop 1396px and mobile 390px/320px, both languages, label cutout resizing, moving data packets, offscreen stopping, local logo assets and no horizontal overflow. This is not physical Safari/Android device certification.
- Dependency audit still reports 83 existing advisories: 1 critical, 20 high, 51 moderate and 11 low. No dependency or lockfile change is part of this release.

## Published verification

- Source `60ceeb99fb14c065df3bf8dbee6283b0c95d8209` was committed, pushed and verified on the GitHub enterprise branch before the final clean rebuild and upload.
- Production Pages deployment: `3b8fc477-a520-4950-9e8e-9c12fd3c7d05`, snapshot `https://3b8fc477.memova-enterprise.pages.dev/`.
- The snapshot's `/enterprise-release.json` was read back and matches the source SHA above. Custom-host manifest requests timed out; snapshot verification is recorded separately rather than misrepresented as a successful custom-host manifest read.
- The browser loaded `https://enterprise.memova.ai/?lang=zh` with the new approved industry text, source categories, LibraryBig icon, no flow/marquee controls and no horizontal overflow. A live 390px viewport also fit, and the temporary viewport override was reset. Broader responsive and language behavior was checked locally before release.
- `GET https://enterprise.memova.ai/api/contact` returned HTTP 405 with `method_not_allowed`, confirming the dedicated service binding remains functional. No new lead or notification was created by this release verification.
- The local enterprise robots/sitemap/canonical checks passed and these generators were unchanged. A live robots request timed out; do not report it as passed. Consumer main remained `053f3c9924ee15373d8c78888659a8cb701b09a6`; no consumer project deployment or write was performed. Main-site snapshot requests did not complete, so no new before/after homepage hash comparison is claimed.
- Company Space `Memova knowledge base / Development / Website source and deployment` was updated with this release and its evidence boundaries. The iCloud vault still fails the host-freshness write boundary; its concise summary remains staged in project4.
- Subsequent documentation-only commits need not match the live source manifest and do not require another deployment.
