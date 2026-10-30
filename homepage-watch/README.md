# Watch homepage

This is the approved Apple Watch website design, migrated as a separate Vite entry while preserving the existing Memova site and APIs. Runtime assets are selected in `public-files.json`; original design sources and unused iterations are intentionally excluded from public delivery.

The homepage opens in English on every fresh load, retaining the manual Chinese switch. English **Watch the film** uses `assets/video/memova-launch-en-v1.mp4` from the supplied English launch movie; Chinese keeps `memova-launch.mp4`. Timeline, My Day and Offline Search demos are separate and unchanged. Initial HTML, SSR and homepage metadata also use English.

The current local revision uses nine real photographs in time order from00:30 to22:30, with bilingual time/title/descriptions. They are noninteractive figures, not links or My Day story previews. Photo provenance and license links are in `PHOTO_CREDITS.md`. The nine original gallery URLs are retired; five source documents used independently by the existing Personal mentor are retained under `/examples/mentor-sources/`. The main Michael My Day, films, Watch and other feature examples remain separate.

On mobile, processing selected conversations opens three outcome covers in a native modal over the current screen, with no extra page scrolling. Only selected outcomes become ready; Choose again and Escape cancel processing and return to the original place. Desktop retains its source-left/results-right layout.

The user authorized uploading and deploying this reviewed revision on2026-10-30, superseding the earlier local-only restriction for this release. Follow the repository's preview, review and clean-main production deployment gates below.

Use the repository's existing commands from the repository root:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm run build
corepack pnpm run check
corepack pnpm test
corepack pnpm run check:seo
```

The build keeps legacy Vite and SEO generation first. `scripts/stage-production-homepage.mjs` then builds this homepage and its Mentor/Chimes entries, renders real first-paint/SEO content with React server rendering, and stages the new entries into `dist/public` without replacing other routes. The client retains its existing interactions and replaces the server-rendered opening when mounted.

All new `/assets` files use a content-addressed `/assets/watch-<revision>/` directory, including fonts and video posters, so the retained immutable caching rule stays correct. Complete examples stay at `/examples/`; only their external favicon/cover-style URLs are updated during staging. Source case text and recording evidence remain intact. The launch film uses a 1080p H.264/AAC fast-start MP4 under the25MiB Pages limit; its full duration and original audio are preserved.

The legacy `/privacy`, `/terms`, `/support`, account/OAuth/MCP routes, Journal, direct demo links, personal-manual functions and D1 binding remain in the original application. Do not copy a Sites Worker or change the Pages project/database bindings.

Before production, deploy a non-main preview and check desktop, phone, Watch unlock/record controls, case readers, films and original routes. Production still uses `corepack pnpm run deploy:production` from a clean `main` exactly matching `origin/main`, after all checks pass.
