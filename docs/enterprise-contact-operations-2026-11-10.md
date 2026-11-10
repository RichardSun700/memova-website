# Enterprise contact form

Status: published and production-tested on 2026-11-10. Source release `e16a9a35f0d15edcf42a7c24d19a6a2f1e2f4702` was pushed to the enterprise GitHub branch before publishing.

## Scope and isolation

User approved replacing the mailto-only contact journey with an independent full-page form, persistent enterprise leads and notifications to `richard@memova.ai`. No calendar is connected and no booking availability is advertised. There is no marketing opt-in or mailing-list subscription.

- Contact page: `https://enterprise.memova.ai/contact`, with English/Chinese content and matching enterprise navigation/footer.
- Same-origin endpoint: `POST /api/contact`; only this path invokes the Pages advanced-mode `_worker.js`.
- Pages project `memova-enterprise` delegates through `CONTACT_API` to Worker `memova-enterprise-contact`. This Worker has no public workers.dev endpoint or route and exposes no list/query endpoint.
- Dedicated D1: `memova_enterprise_leads`, ID `99c88127-5d04-4721-bbc1-f67673fc33e7`, table `enterprise_leads`. Do not bind a consumer or waitlist database here.
- Fixed-destination email binding `EMAIL` can send only to `richard@memova.ai`. Sender is `noreply@memova.ai`; no MX, DNS, domain verification or mailbox setting is changed by this release.
- Original 2C homepage, routes, waitlist Worker, database and navigation remain out of scope.

## Data handling

Required fields are name, email and inquiry text. Company and category are optional. Personal and education email addresses are accepted. Client and server both validate fields; submitted personal data is not written to logs or localStorage.

The API enforces the enterprise origin, JSON content type, a bounded streamed body (16KB), field lengths, a honeypot and atomic per-email/per-network-source submission limits. A daily one-way source-address digest is stored temporarily for abuse prevention, not a raw address; the scheduled task clears digests older than seven days. This is not a claim of irreversible anonymization or a complete anti-bot system. Escalate to Turnstile if abuse warrants it.

The browser generates a random request UUID, retained across retries of unchanged input. The database enforces its uniqueness. A success response is sent only after the lead is stored, never merely after a button click. Retried requests must match the original payload. The form preserves entered values on errors and focuses a visible status message. Email is shown in selectable text with copy and manual-copy fallback; Cloudflare's email-obfuscation exclusion wraps the source-rendered address.

There is no public access to submitted records. Restrict Cloudflare account/D1 access to the business team and handle retention/deletion requests through company operations. Long-term lead retention requires a separate company policy; this change does not auto-delete the lead list.

## Notification outbox

Lead creation queues a notification. A database lease limits simultaneous senders. Failed sends remain recorded, with exponential retry timing; a scheduled Worker task runs every ten minutes. Delivery is attempted up to five times; then staff can review and explicitly requeue. A provider-accepted message is not proof of inbox receipt. Email delivery is at least once, not a guarantee of exactly once after a crash between sending and recording success.

Query the lead list in authenticated D1 tooling (not through a public website route):

```sql
SELECT id,name,email,company,category,message,language,created_at,
       notification_state,notification_attempts,notification_error
FROM enterprise_leads ORDER BY created_at DESC;
```

After investigating a specific failed notification, reset only its state/attempts and next-at timestamp; do not clear the entire queue or touch the consumer database. Synthetic deployment-test records are clearly named and must not be reported as customers.

## Release and permissions

1. Fetch the latest enterprise branch; work in a clean isolated checkout.
2. Run TypeScript, enterprise Vitest tests, `node --test worker/enterprise/contact.test.mjs`, the standalone build, `node scripts/verify-enterprise.mjs` and desktop/mobile browser validation. Record existing dependency-audit warnings separately.
3. Review and push the exact source commit to GitHub before publishing either backend or frontend.
4. Apply `worker/enterprise/schema.sql` only to the dedicated D1 database.
5. Publish the dedicated Worker with the D1 and fixed-destination EMAIL bindings and the ten-minute scheduled trigger. Keep workers.dev disabled.
6. Build the standalone artifact and upload only `dist/enterprise` to Pages project `memova-enterprise`, with the `CONTACT_API` service binding. The enterprise-site Wrangler config is separate from the root 2C config.
7. Test an explicitly synthetic inquiry. Read back its D1 row and notification state, test a same-ID retry, and distinguish SMTP acceptance from actual mailbox delivery. Check errors, mobile layout, copy fallback and all CTA destinations. Confirm the 2C main-site hash is unchanged.

The user separately approved a token restricted to the current Cloudflare account with exactly Pages Edit, Workers Scripts Edit and D1 Edit. Its lifetime must be under 24 hours; it is used only in local process memory, with no token in code, GitHub or logs. The local deployment bridge limits requests to enterprise Pages/Worker paths and account D1 APIs. Close it and clear browser-held token state after deployment; do not reuse the previously rejected 29-permission OAuth grant.

Cloudflare references: [Pages direct upload and advanced worker support](https://developers.cloudflare.com/pages/get-started/direct-upload/), [send bindings](https://developers.cloudflare.com/email-service/configuration/send-bindings/). The paired vault remains read-only under the previously reported stale-host boundary; this record is pending safe vault sync.

## Validation evidence

- TypeScript and standalone build passed during implementation.
- 13 focused React/enterprise checks and 7 Node/SQLite backend tests passed. Backend checks include persistence before mail, notification failure, idempotency, conflicts, input/origin/size checks, rate limits, database failure and scheduled retry.
- Existing repository dependency audit remains failing: 83 pre-existing advisories (1 critical, 20 high, 51 moderate, 11 low); no dependency or lockfile change is included.
- Live page: `https://enterprise.memova.ai/contact`; deployment preview: `https://41e003e7.memova-enterprise.pages.dev`. The live release manifest matches source `e16a9a35f0d15edcf42a7c24d19a6a2f1e2f4702`.
- Worker deployment ID: `44ea3e6bd6c344e5b963279cff02bffd`. Verified native D1 and restricted email bindings; workers.dev and preview endpoints disabled; cron saved as `*/10 * * * *`.
- Live browser form submission showed a real success state. Synthetic test reference: `8754c277-9799-404e-b899-21eb0d1ec7c7`; its name explicitly says not a customer lead. Its D1 row exists, `notification_state=sent`, `notification_attempts=1`, and `notification_error=NULL`. Retrying the same request returned the original reference, kept `matching_records=1` and did not add a notification attempt.
- The mail service accepted the notification to `richard@memova.ai`. Inbox receipt was not independently read: the available Outlook search tool could not be invoked. Do not describe this as observed inbox delivery.
- A disallowed-origin POST returned HTTP 403. The endpoint exposes no unauthenticated lead list.
- Browser checked local 390px and 320px layouts, 16px input text, preserved input after a real failed request, copy-email success and no overflow. The live 390px success state also fits. These are desktop-Chrome viewport checks, not physical Safari/Android/WeChat-device certification. All four live home-page CTAs point to `/contact?lang=zh`, and the hero CTA opens the actual contact page.
- The 2C homepage SHA-256 was identical before and after: `a6b5c44e759da868222572b55b6794c01e387ec0a3a2d10784812be753685f4b`.
- The limited deployment token has exactly the three approved permissions and expires 2026-11-10 23:59 (UTC+8), within 24 hours of creation. The initial date-only picker produced a longer end-of-day expiry; it was shortened immediately and the API expiry was verified before deployment. The local credential process has been terminated and its in-memory token cleared. No credential was put in code, GitHub or this record. The token will expire automatically; it was not described as revoked.
