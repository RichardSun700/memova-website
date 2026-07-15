#!/usr/bin/env bash

set -euo pipefail

fail() {
  printf 'Production deployment stopped: %s\n' "$1" >&2
  exit 1
}

repo_root=$(git rev-parse --show-toplevel)
cd "$repo_root"

node scripts/verify-production-source.mjs

if [[ -n "$(git status --porcelain=v1 --untracked-files=all)" ]]; then
  fail "the worktree contains uncommitted or untracked files"
fi

if [[ "$(git branch --show-current)" != "main" ]]; then
  fail "run this command from the local main branch"
fi

git fetch origin main
git merge-base --is-ancestor origin/main HEAD || \
  fail "local main is behind or has diverged from origin/main"

npx wrangler whoami >/dev/null
pnpm test
pnpm run check
pnpm run build
pnpm run check:seo

git push origin HEAD:main
git fetch origin main

if [[ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]]; then
  fail "GitHub main does not match the verified local commit"
fi

npx wrangler pages deploy dist/public --project-name=memova --branch=main
