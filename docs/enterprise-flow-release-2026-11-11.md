# Enterprise knowledge flow release

Date: 2026-11-11. Scope: enterprise frontend only. Consumer main and the contact backend are not release targets.

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

Append the actual deployed source, deployment ID and live readback results below after publication. Do not treat this prepared record or a GitHub push as proof of deployment.
