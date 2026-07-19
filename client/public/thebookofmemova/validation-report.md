# Memova Company Memory Book v0.5 · Validation Report

Date: 2026-07-19
Audience: Internal
Result: PASS

## Contract

- One Book: `memova-company-memory-book`
- Four Chapters
- Ten HTML Pages, including Library Home
- Reading priorities: `0..9`, unique
- Authority: `CURRENT > MANIFESTO > FOUNDATION > EVIDENCE > HISTORICAL > OPEN`
- Every page has matching `book_id`, `chapter_id`, state, canonical Markdown, and reading priority in its embedded Page JSON.
- The raw `Memo #000001` archive is absent from the v0.5 manifest, navigation, source set, and package allowlist.

## Static checks

- `node scripts/validate-memory-book.mjs`: PASS
- Generator and validator syntax checks: PASS
- All manifest HTML and Markdown paths exist.
- All local links in the ten manifest Pages resolve.
- Every Page uses `noindex,nofollow`.
- No duplicate DOM IDs were found.
- No current v0.5 content uses the old `pivot` framing.

## Browser checks

Desktop viewport: `1440 × 1000`

- All ten Pages rendered successfully.
- No horizontal overflow on any Page.
- No browser console warnings or errors.
- Home first viewport contains the manifesto promise, founder wedge, and primary manifesto CTA.

Mobile viewport: `390 × 844`

- All ten Pages rendered successfully.
- No horizontal overflow on any Page.
- The mobile directory is visible and opens correctly.
- The manifesto filter leaves exactly the MANIFESTO Page visible.

## Privacy and publication

- All Pages are labeled `Direct Link · Noindex`.
- Production target: `https://memova.ai/thebookofmemova/`; direct-link access is allowed while search indexing is disabled.
- Password/login access described in the product definition is not represented as an implemented feature of this static demo.

## Package boundary

The v0.5 ZIP is built from an explicit allowlist. Historical v0.2/v0.3/v0.4 ZIPs, `.DS_Store`, the raw Memo archive, workspace files, and unrelated artifacts are excluded.
