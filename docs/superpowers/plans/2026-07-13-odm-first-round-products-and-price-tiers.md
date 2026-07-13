# ODM First-Round Products and Price Tiers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the hidden ODM partnership page so recording cards, clip-on headphones, and smart glasses are all first-round validation products, while concrete retail prices become approved qualitative tiers.

**Architecture:** Keep the existing standalone static HTML structure and its hidden-route controls unchanged. Add regression assertions to the existing SEO build test, then update only the affected ODM copy and price labels before running unit, type, build, and browser checks.

**Tech Stack:** Static HTML/CSS, TypeScript, Vitest, Vite, Playwright browser QA.

## Global Constraints

- First-round validation products are recording card, clip-on headphones, and smart glasses.
- Price tiers are: 录音卡 `入门级`, 手表扣 `主流级`, 夹耳式耳机 `主流级`, 智能眼镜 `专业级`, Memova Pen `奢侈品级`.
- The page must not display `US$90`, `US$120`, `US$150`, `US$200`, or `US$500`.
- `/odmpartnership/` remains `noindex, nofollow`.
- Do not deploy before the user reviews the local page.

---

### Task 1: Lock the new content contract in tests

**Files:**
- Modify: `client/src/seo/generateSeoPages.test.ts`
- Test: `client/src/seo/generateSeoPages.test.ts`

**Interfaces:**
- Consumes: the static ODM HTML at `client/public/odmpartnership/index.html`.
- Produces: regression assertions for first-round product scope, price tiers, and removed prices.

- [x] **Step 1: Add failing assertions to the existing hidden ODM page test**

Add these assertions after reading `odmHtml`:

```ts
expect(odmHtml).toContain("首轮合作产品：录音卡、夹耳式耳机、智能眼镜");
expect(odmHtml).toContain("录音卡、夹耳式耳机和智能眼镜工程样机");
expect(odmHtml).toContain('<h3>录音卡</h3><div class="hardware-price">入门级</div>');
expect(odmHtml).toContain('<h3>手表扣</h3><div class="hardware-price">主流级</div>');
expect(odmHtml).toContain('<h3>夹耳式耳机</h3><div class="hardware-price">主流级</div>');
expect(odmHtml).toContain('<h3>智能眼镜</h3><div class="hardware-price">专业级</div>');
expect(odmHtml).toContain('<h3>Memova Pen</h3><div class="hardware-price">奢侈品级</div>');
expect(odmHtml).not.toMatch(/US\$(90|120|150|200|500)/);
```

- [x] **Step 2: Run the focused test and verify it fails**

Run:

```bash
./node_modules/.bin/vitest run client/src/seo/generateSeoPages.test.ts
```

Expected: FAIL because the current page still contains two-product first-round copy and exact prices.

### Task 2: Update ODM page scope and tier labels

**Files:**
- Modify: `client/public/odmpartnership/index.html`

**Interfaces:**
- Consumes: the approved copy contract from Task 1.
- Produces: the reviewable static ODM page at `client/public/odmpartnership/index.html`.

- [x] **Step 1: Update every first-round scope reference**

Use this copy contract in the relevant existing sections:

```html
<span>首轮合作产品：录音卡、夹耳式耳机、智能眼镜</span>
```

The first cooperation package must begin with:

```html
<p>录音卡、夹耳式耳机和智能眼镜工程样机，打通设备激活、音视频捕捉、App 上传、Memory OS 结构化、Agent follow-up 和 OTA 基础链路。</p>
```

The first-SKU panel must describe all three products as first-round validation products, including smart-glasses checks for first-person visual context, audiovisual capture, wearability, privacy indication, and end-to-end data integrity. It must state that engineering parallelism and sample order depend on the ODM's existing reference designs.

- [x] **Step 2: Replace concrete prices with approved tiers**

Replace the five `.hardware-price` values with:

```html
<div class="hardware-price">入门级</div>
<div class="hardware-price">主流级</div>
<div class="hardware-price">主流级</div>
<div class="hardware-price">专业级</div>
<div class="hardware-price">奢侈品级</div>
```

Replace the price disclaimer with:

```html
<span>以上为产品价格等级的方向性定位，不是建议零售价、目标 BOM 或量产报价。</span>
```

- [x] **Step 3: Run the focused test and verify it passes**

Run:

```bash
./node_modules/.bin/vitest run client/src/seo/generateSeoPages.test.ts
```

Expected: all tests in `generateSeoPages.test.ts` PASS.

### Task 3: Verify the review artifact

**Files:**
- Verify: `client/public/odmpartnership/index.html`
- Verify: `dist/public/odmpartnership/index.html`

**Interfaces:**
- Consumes: the updated static source and tests from Tasks 1-2.
- Produces: a built HTML artifact ready for user review, without deployment.

- [x] **Step 1: Run full static verification**

Run:

```bash
./node_modules/.bin/pnpm run check
./node_modules/.bin/pnpm run build
```

Expected: TypeScript check passes; production build finishes successfully; SEO verification reports zero errors.

- [x] **Step 2: Confirm source and built ODM pages match**

Run:

```bash
cmp client/public/odmpartnership/index.html dist/public/odmpartnership/index.html
```

Expected: exit code `0` and no output.

- [x] **Step 3: Inspect desktop and mobile layouts**

Open the built page in a browser at desktop `1440x900` and mobile `390x844`. Confirm the five tier labels render without overlap, the three first-round products are visible in the relevant sections, there is no horizontal overflow, and the console contains no errors.

- [x] **Step 4: Prepare the review copy**

Copy the verified source HTML to:

```text
/Users/mingyusun/Documents/New project 4/outputs/memova_odm_partnership_hybrid_2026-07-13_zh.html
```

The user can open this file locally before authorizing deployment.

- [x] **Step 5: Commit the local implementation**

```bash
git add client/public/odmpartnership/index.html client/src/seo/generateSeoPages.test.ts docs/superpowers/plans/2026-07-13-odm-first-round-products-and-price-tiers.md
git commit -m "feat: expand ODM first-round validation products"
```

Expected: one local commit on `codex/seo-geo-foundation`; no push or Cloudflare deployment.
