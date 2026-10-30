# Watch homepage

This is the approved Apple Watch website design, migrated as a separate Vite entry while preserving the existing Memova site and APIs. Runtime assets are selected in `public-files.json`; original design sources and unused iterations are intentionally excluded from public delivery. The active nine story illustrations are the people-free, richer clay-v4 set. Stock photos were only shortlisted and have not been substituted.

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
