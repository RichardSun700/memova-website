# Production Source of Truth and Hidden Pages Redeploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make GitHub `main` the complete production source, prevent dirty public files from entering a Pages build, and redeploy the approved ODM and Jiang Weili pages without losing the Google OAuth privacy update.

**Architecture:** Merge `origin/main` into the isolated, complete SEO/ODM branch. Add a pure, unit-tested production-source validator plus a guarded production deployment script. Push the verified integrated commit to GitHub `main`, deploy that exact build to Cloudflare Pages, and verify both hidden pages and the privacy-policy routes.

**Tech Stack:** Git, Node.js ESM, Vitest, TypeScript, Vite, pnpm, Wrangler 4, Cloudflare Pages.

## Global Constraints

- GitHub `main` is the only production source of truth.
- Do not automatically stage or commit unknown dirty files.
- Reject deployment when tracked or untracked production inputs are dirty.
- Preserve Google OAuth Privacy Policy content from commit `a28a71c`.
- Preserve `/odmpartnership/`, `/team/weilijiang/`, `_headers`, `_redirects`, SEO generation, and real 404 behavior.
- Push the verified commit to GitHub before uploading the same build to Cloudflare Pages.
- Do not enable Cloudflare Git integration in this change.
- Do not delete files from the old dirty `main` worktree.

---

## File Structure

- Create `scripts/verify-production-source.mjs`: pure status parser plus CLI that rejects dirty production inputs and missing required tracked pages.
- Create `client/src/seo/verifyProductionSource.test.mjs`: unit tests for clean, dirty, untracked, renamed, and missing-required-path cases.
- Create `scripts/deploy-production.sh`: guarded production sequence for future deployments from a clean local `main`.
- Modify `package.json`: expose `check:production-source` and `deploy:production` commands.
- Modify `client/src/seo/generateSeoPages.test.ts`: retain route/content assertions after integrating `origin/main`.
- Modify `docs/superpowers/plans/2026-07-15-production-source-of-truth-and-redeploy.md`: mark completed checkpoints.

### Task 1: Integrate the Latest GitHub Main

**Files:**
- Merge: `origin/main` into `codex/seo-geo-foundation`
- Verify: `client/src/content/privacy-policy.md`
- Verify: `client/public/odmpartnership/index.html`
- Verify: `client/public/team/weilijiang/index.html`
- Verify: `client/public/_headers`
- Verify: `client/public/_redirects`

**Interfaces:**
- Consumes: Git commit `a28a71c` and the current SEO/ODM branch.
- Produces: one integrated branch containing privacy, SEO, ODM, and team-profile artifacts.

- [ ] **Step 1: Fetch the latest production branch**

Run:

```bash
git fetch origin main
git log --oneline --decorate -5 origin/main
```

Expected: `origin/main` includes `a28a71c Update privacy policy for Google OAuth`.

- [ ] **Step 2: Merge without publishing**

Run:

```bash
git merge --no-ff origin/main -m "merge: integrate latest production main"
```

Expected: merge succeeds or exposes explicit conflicts to resolve before continuing.

- [ ] **Step 3: Verify all production artifacts survived the merge**

Run:

```bash
git ls-files --error-unmatch client/public/odmpartnership/index.html
git ls-files --error-unmatch client/public/team/weilijiang/index.html
rg -n "Google Sign-In|Limited Use" client/src/content/privacy-policy.md
rg -n "首轮合作产品：录音卡、夹耳式耳机、智能眼镜|入门级|奢侈品级" client/public/odmpartnership/index.html
rg -n "江维力|Jiang Weili" client/public/team/weilijiang/index.html
```

Expected: both hidden pages are tracked and all content markers are present.

### Task 2: Add a Failing Production-Source Gate Test

**Files:**
- Create: `client/src/seo/verifyProductionSource.test.mjs`
- Create later: `scripts/verify-production-source.mjs`

**Interfaces:**
- Consumes: porcelain-v1 Git status text and a set of tracked file paths.
- Produces: tests for `findProductionSourceViolations(statusOutput, trackedPaths)`.

- [ ] **Step 1: Write the RED test**

Create tests that import `findProductionSourceViolations` and assert:

```ts
expect(findProductionSourceViolations("", tracked)).toEqual([]);
expect(findProductionSourceViolations("?? client/public/odmpartnership/index.html\n", tracked))
  .toContain("Dirty production input: ?? client/public/odmpartnership/index.html");
expect(findProductionSourceViolations(" M client/public/_headers\n", tracked))
  .toContain("Dirty production input: M client/public/_headers");
expect(findProductionSourceViolations("", new Set()))
  .toContain("Required tracked path is missing: client/public/odmpartnership/index.html");
```

The required tracked-path list must include the ODM page, Jiang Weili page, `_headers`, and `_redirects`.

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
./node_modules/.bin/vitest run client/src/seo/verifyProductionSource.test.mjs
```

Expected: FAIL because `scripts/verify-production-source.mjs` does not exist.

- [ ] **Step 3: Commit the validated RED checkpoint**

```bash
git add client/src/seo/verifyProductionSource.test.mjs docs/superpowers/plans/2026-07-15-production-source-of-truth-and-redeploy.md
git commit -m "test: reproduce dirty production source deployment"
```

### Task 3: Implement the Production-Source Gate

**Files:**
- Create: `scripts/verify-production-source.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `findProductionSourceViolations(statusOutput: string, trackedPaths: Set<string>): string[]`.
- CLI exit code: `0` for a clean source; `1` with each violation printed to stderr.

- [ ] **Step 1: Implement the pure validator**

The module must export:

```js
export const REQUIRED_TRACKED_PATHS = [
  "client/public/odmpartnership/index.html",
  "client/public/team/weilijiang/index.html",
  "client/public/_headers",
  "client/public/_redirects",
];

export function findProductionSourceViolations(statusOutput, trackedPaths) {
  const violations = [];
  for (const line of statusOutput.split("\n").filter(Boolean)) {
    violations.push(`Dirty production input: ${line.trimEnd()}`);
  }
  for (const requiredPath of REQUIRED_TRACKED_PATHS) {
    if (!trackedPaths.has(requiredPath)) {
      violations.push(`Required tracked path is missing: ${requiredPath}`);
    }
  }
  return violations;
}
```

The CLI must gather scoped status with:

```bash
git status --porcelain=v1 --untracked-files=all -- client/public client/src/seo scripts package.json
```

and tracked files with:

```bash
git ls-files -- client/public/odmpartnership/index.html client/public/team/weilijiang/index.html client/public/_headers client/public/_redirects
```

- [ ] **Step 2: Add the package command**

Add:

```json
"check:production-source": "node scripts/verify-production-source.mjs"
```

- [ ] **Step 3: Run focused tests and CLI**

Run:

```bash
./node_modules/.bin/vitest run client/src/seo/verifyProductionSource.test.mjs
./node_modules/.bin/pnpm run check:production-source
```

Expected: tests PASS; CLI PASS after the implementation changes are committed.

- [ ] **Step 4: Commit the GREEN checkpoint**

```bash
git add scripts/verify-production-source.mjs package.json
git commit -m "fix: block dirty production source deployments"
```

### Task 4: Add the Guarded Production Deployment Command

**Files:**
- Create: `scripts/deploy-production.sh`
- Modify: `package.json`

**Interfaces:**
- Consumes: a clean local `main`, authenticated GitHub remote, authenticated Wrangler.
- Produces: pushed GitHub `main` followed by a Cloudflare Pages production deployment of the same commit.

- [ ] **Step 1: Create the guarded shell command**

The script must use `set -euo pipefail` and run in this order:

```bash
node scripts/verify-production-source.mjs
test "$(git branch --show-current)" = "main"
git fetch origin main
git merge-base --is-ancestor origin/main HEAD
pnpm test
pnpm run check
pnpm run build
pnpm run check:seo
git push origin HEAD:main
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)"
npx wrangler pages deploy dist/public --project-name=memova --branch=main
```

Each failed precondition must print a concise error and stop before `git push` or Wrangler.

- [ ] **Step 2: Add the package command**

Add:

```json
"deploy:production": "bash scripts/deploy-production.sh"
```

- [ ] **Step 3: Validate shell syntax without deploying**

Run:

```bash
bash -n scripts/deploy-production.sh
```

Expected: exit `0`.

- [ ] **Step 4: Commit the deployment command**

```bash
git add scripts/deploy-production.sh package.json
git commit -m "chore: standardize production deployment"
```

### Task 5: Verify, Push GitHub Main, and Deploy

**Files:**
- Build: `dist/public/**`
- No source edits expected.

**Interfaces:**
- Consumes: integrated, committed branch.
- Produces: GitHub `main` and Cloudflare Pages production from the same commit.

- [ ] **Step 1: Run the complete local gate**

Run:

```bash
./node_modules/.bin/pnpm run check:production-source
./node_modules/.bin/pnpm test
./node_modules/.bin/pnpm run check
./node_modules/.bin/pnpm run build
./node_modules/.bin/pnpm run check:seo
cmp -s client/public/odmpartnership/index.html dist/public/odmpartnership/index.html
cmp -s client/public/team/weilijiang/index.html dist/public/team/weilijiang/index.html
```

Expected: 0 failures and matching source/build HTML files.

- [ ] **Step 2: Push the verified integrated branch to GitHub main**

Run:

```bash
git fetch origin main
git merge-base --is-ancestor origin/main HEAD
git push origin HEAD:main
git fetch origin main
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)"
```

Expected: GitHub `main` equals local `HEAD`.

- [ ] **Step 3: Verify Cloudflare authentication**

Run:

```bash
npx wrangler whoami
```

Expected: account `b02aa028ef87c390b275f53c3c83407f` with Pages write access.

- [ ] **Step 4: Deploy the already-built artifact**

Run:

```bash
npx wrangler pages deploy dist/public --project-name=memova --branch=main
```

Expected: a new production deployment URL and source commit equal to GitHub `main`.

### Task 6: Verify Production and Synchronize Durable Records

**Files:**
- Modify: vault `40_projects/memova/memova_odm_hardware_partnership_2026-07-10.md`
- Modify: vault `40_projects/memova/Memova Website.md`
- Modify: vault `log.md`

**Interfaces:**
- Consumes: production deployment URL and GitHub commit.
- Produces: verified routes and durable deployment record.

- [ ] **Step 1: Verify routes and headers with desktop and mobile user agents**

Check:

```text
https://memova.ai/odmpartnership
https://memova.ai/odmpartnership/
https://memova.ai/team/weilijiang
https://memova.ai/team/weilijiang/
https://memova.ai/privacy-policy
https://memova.ai/privacy
```

Expected: all intended routes return `200` after redirects; both hidden pages return `X-Robots-Tag: noindex, nofollow`.

- [ ] **Step 2: Verify exact live content**

ODM must contain:

```text
首轮合作产品：录音卡、夹耳式耳机、智能眼镜
录音卡 / 入门级
手表扣 / 主流级
夹耳式耳机 / 主流级
智能眼镜 / 专业级
Memova Pen / 奢侈品级
```

ODM must not contain `US$90`, `US$120`, `US$150`, `US$200`, or `US$500`.

Jiang Weili must contain `江维力` and its approved CMO profile content. Privacy routes must retain `Google Sign-In and Google Workspace Permissions` and `Limited Use`.

- [ ] **Step 3: Perform desktop and mobile browser QA**

Use 1440x900 and 390x844. Expected: no 404, no horizontal overflow, no framework error overlay, correct page titles and core content.

- [ ] **Step 4: Update vault records**

Record the GitHub commit, Cloudflare deployment ID/URL, both route checks, privacy preservation, and the new dirty-source deployment guard.

- [ ] **Step 5: Confirm final repository state**

Run:

```bash
git status --short
git rev-parse HEAD
git rev-parse origin/main
```

Expected: clean worktree and identical local/GitHub commits.
