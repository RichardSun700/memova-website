# Memova Company Memory Book v0.5

This internal HTML book is both company knowledge and a working demonstration of the Memova product model: Context becomes a canonical Page, related Pages become Chapters inside a Book, and Books accumulate into a personal memory and knowledge Library.

## Start

- Human entry: `index.html`
- Agent entry: `llms.txt`
- Structured contract: `manifest.json`
- Current-product single page: `share/current-product.html`

## Reading order

1. **Chapter 01 · 用户宣言——被记住的未来** (`MANIFESTO`)
   - The enduring promise: a person’s value is not merely to be recorded, but to continue to be understood.
2. **Chapter 02 · 第一把尖刀** (`CURRENT`)
   - The founder wedge, product model, private sharing, optional distribution, and MVP success criteria.
3. **Chapter 03 · Why Memova** (`FOUNDATION`)
   - Stable principles, the product system, memory authority, and natural interfaces.
4. **Chapter 04 · How We Got Here** (`EVIDENCE` / `OPEN`)
   - Evolution, evidence, historical context, and unresolved decisions.

The raw `Memo #000001` philosophy archive is intentionally not part of v0.5. It remains preserved in the personal vault and historical v0.3/v0.4 shared copies.

## Authority

`CURRENT > MANIFESTO > FOUNDATION > EVIDENCE > HISTORICAL > OPEN`

`CURRENT` decides what the product does now. `MANIFESTO` defines the durable human promise. `OPEN` is never a confirmed product fact.

## Content model

- Canonical agent-readable content lives in `content/*.md`.
- Human-readable projections are HTML pages.
- Every book page exposes a `.page-data` JSON block matching `manifest.json`.
- All pages are published at `https://memova.ai/thebookofmemova/` for direct-link access and remain `noindex,nofollow`.

## Version

- Version: `0.5`
- Updated: `2026-07-19`
- Audience: Memova team and authorized agents
