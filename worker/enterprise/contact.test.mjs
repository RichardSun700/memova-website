import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import { createContactWorker, validateInquiry } from "./contact.mjs";

function fixture(send = async () => {}) {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(
    fs.readFileSync(new URL("./schema.sql", import.meta.url), "utf8")
  );
  const DB = {
    prepare(sql) {
      const statement = sqlite.prepare(sql);
      let values = [];
      return {
        bind(...args) {
          values = args;
          return this;
        },
        async first() {
          return statement.get(...values) || null;
        },
        async all() {
          return { results: statement.all(...values) };
        },
        async run() {
          const result = statement.run(...values);
          return { meta: { changes: Number(result.changes) } };
        },
      };
    },
  };
  const pending = [];
  const ctx = {
    waitUntil(promise) {
      pending.push(promise);
    },
  };
  const worker = createContactWorker((_env, message) => send(message));
  return { DB, sqlite, ctx, worker, flush: () => Promise.all(pending) };
}
const payload = () => ({
  requestId: crypto.randomUUID(),
  name: "Example Researcher",
  email: "test@example.edu",
  company: "",
  category: "knowledge",
  message: "Synthetic test of an enterprise knowledge-base inquiry.",
  language: "en",
  website: "",
});
const request = (body, origin = "https://enterprise.memova.ai", headers = {}) =>
  new Request("https://enterprise.memova.ai/api/contact", {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      "CF-Connecting-IP": "192.0.2.20",
      ...headers,
    },
    body: JSON.stringify(body),
  });
test("accepts personal/education emails, optional company and valid bilingual fields", () => {
  assert.ok(validateInquiry(payload()));
  assert.ok(
    validateInquiry({
      ...payload(),
      email: "example@gmail.com",
      language: "zh",
    })
  );
  assert.equal(
    validateInquiry({ ...payload(), email: "bad\r\nBcc: x@example.com" }),
    null
  );
  assert.equal(validateInquiry({ ...payload(), message: "short" }), null);
  assert.equal(validateInquiry({ ...payload(), name: {} }), null);
});
test("stores before notification and survives mail failures without losing a lead", async () => {
  const f = fixture(async () => {
    assert.equal(
      f.sqlite.prepare("SELECT COUNT(*) n FROM enterprise_leads").get().n,
      1
    );
    throw Error("mail failure");
  });
  const response = await f.worker.fetch(request(payload()), f, f.ctx);
  assert.equal(response.status, 201);
  assert.equal((await response.json()).status, "received");
  await f.flush();
  assert.equal(
    f.sqlite.prepare("SELECT notification_state FROM enterprise_leads").get()
      .notification_state,
    "failed"
  );
});
test("repeated requests are idempotent and notifications have a delivery lease", async () => {
  let sent = 0;
  const f = fixture(async msg => {
    assert.equal(msg.to, "richard@memova.ai");
    sent++;
  });
  const data = payload();
  const first = await f.worker.fetch(request(data), f, f.ctx);
  const second = await f.worker.fetch(request(data), f, f.ctx);
  assert.equal((await first.json()).reference, (await second.json()).reference);
  await f.flush();
  assert.equal(sent, 1);
  assert.equal(
    f.sqlite.prepare("SELECT COUNT(*) n FROM enterprise_leads").get().n,
    1
  );
  const conflict = await f.worker.fetch(
    request({ ...data, message: "A different long message." }),
    f,
    f.ctx
  );
  assert.equal(conflict.status, 409);
});
test("rejects off-site requests, malformed/oversized payloads and honeypot", async () => {
  const f = fixture();
  assert.equal(
    (
      await f.worker.fetch(
        request(payload(), "https://other.example"),
        f,
        f.ctx
      )
    ).status,
    403
  );
  assert.equal(
    (
      await f.worker.fetch(
        request({ ...payload(), website: "spam.example" }),
        f,
        f.ctx
      )
    ).status,
    400
  );
  assert.equal(
    (
      await f.worker.fetch(
        request({ ...payload(), message: "a".repeat(17000) }),
        f,
        f.ctx
      )
    ).status,
    413
  );
  assert.equal(
    f.sqlite.prepare("SELECT COUNT(*) n FROM enterprise_leads").get().n,
    0
  );
});
test("rate limits new submissions without blocking a genuine idempotent retry", async () => {
  const f = fixture();
  const first = payload();
  for (let i = 0; i < 3; i++) {
    const response = await f.worker.fetch(
      request(i ? payload() : first),
      f,
      f.ctx
    );
    assert.equal(response.status, 201);
  }
  assert.equal(
    (await f.worker.fetch(request(payload()), f, f.ctx)).status,
    429
  );
  assert.equal((await f.worker.fetch(request(first), f, f.ctx)).status, 200);
  await f.flush();
});
test("database failure is not reported as received", async () => {
  const f = fixture();
  const response = await f.worker.fetch(
    request(payload()),
    {
      DB: {
        prepare() {
          throw Error("offline");
        },
      },
    },
    f.ctx
  );
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
});
test("scheduled job retries failed notification without duplicating the lead", async () => {
  let shouldFail = true,
    sent = 0;
  const f = fixture(async () => {
    if (shouldFail) throw Error("not ready");
    sent++;
  });
  await f.worker.fetch(request(payload()), f, f.ctx);
  await f.flush();
  shouldFail = false;
  f.sqlite.exec("UPDATE enterprise_leads SET notification_next_at=0");
  await f.worker.scheduled({}, f, f.ctx);
  await f.flush();
  assert.equal(sent, 1);
  assert.equal(
    f.sqlite.prepare("SELECT notification_state FROM enterprise_leads").get()
      .notification_state,
    "sent"
  );
});
