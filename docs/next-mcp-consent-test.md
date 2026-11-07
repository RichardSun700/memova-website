# Temporary Next MCP consent site

This checkout supplies the temporary test consent site. It is not the new official website. Do not run this repository's production deployment script to publish this change.

## User flow

1. The MCP client starts OAuth. The backend redirects to `/mcp/oauth/consent?request_id=...`.
2. If needed, the site sends the user to `/login?next=<encoded local consent path>`. Existing login returns to that path, preserving the request ID.
3. Before approval, show requested permissions and the return/reload/read verification steps. The persistent `/mcp/setup` guide opens in a separate tab with `noopener noreferrer` and remains available after the callback.
4. Approval means only that access was approved. The page sends the backend-returned callback URI exactly as received after three seconds, or when the user clicks Continue. Do not replace its URI, `code`, `state`, or PKCE flow with an invented desktop deep link.
5. A callback does not guarantee desktop focus. The user returns to the original agent/chat. If tools are absent, use the client's supported reload/restart action; Codex's current documented path is Settings → MCP servers → Restart.
6. For Next grants, verify `get_next_account` and one unfiltered `search_next_data(limit=3)` in the current chat. This site cannot inspect that chat and never claims its tools are ready. Other grant types retain generic permitted-read verification.

There is one automatic callback attempt. If navigation is blocked, the button becomes available again after six seconds; a thrown navigation error produces visible recovery text. The page never repeatedly approves or automatically replays authorization codes. If the client already reports sign-in success, return to the chat. Failed/expired callbacks require a fresh authorization from the client.

Client-name matching selects display guidance only; client names are not identity verification. Unknown clients get generic guidance. Key setup/consent guidance supports English and Simplified Chinese. `/mcp/setup?surface=legacy` does not advertise Next-only tools or install prompts for legacy grants.

## Build and host

Compile the temporary build with explicit public values:

- `VITE_API_BASE_URL`: the isolated Next MCP API origin (no `/v1` suffix).
- `VITE_MCP_ENVIRONMENT=isolated-test`: labels synthetic-data test environment.
- Optional `VITE_MCP_SERVER_URL`: explicit HTTPS MCP URL. Otherwise, the setup page uses the explicitly configured API origin plus `/mcp/next`. It does not silently point to production when no base URL was supplied.

These are public build settings, not secrets. Use `corepack pnpm exec vite build`; the production marketing/SEO/deploy pipeline is outside this temporary deployment.

The static host must serve the app shell with HTTP 200 on direct requests to `/login`, `/mcp/oauth/consent`, `/mcp/setup`, `/profile`, and `/connected-clients`. Preserve query strings. The `/mcp/setup` route is new and must be added to the isolated asset packager. Its prompt is selectable even if clipboard permission is unavailable.

## Focused verification

`corepack pnpm exec vitest run --root . client/src/pages/McpConsent.test.tsx`

Seven behavioral cases cover preapproval guidance, login return state, exact callback/no premature-ready claim, blocked-navigation recovery/no automatic loop, cancellation, expired requests, and Next versus legacy guidance. `corepack pnpm exec tsc --noEmit` checks types. A real hosted browser → native Codex login/read acceptance is separate and must be reported independently.

Do not run the repository-wide test command as part of this bounded consent change: it collects more than 100 cases and requires separate approval. Do not infer production readiness, email delivery, other-client compatibility, or the new official website's API from these tests.

Official Codex setup reference: https://learn.chatgpt.com/docs/extend/mcp
