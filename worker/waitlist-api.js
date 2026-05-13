import { EmailMessage } from "cloudflare:email";

const NOTIFY_TO = "richard@memova.ai";
const NOTIFY_FROM = "noreply@memova.ai";

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "https://memova.ai",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      ...init.headers,
    },
  });
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function buildEmail(email, createdAt, source) {
  const safeSource = source || "memova.ai";
  return [
    `From: MEMOVA Waitlist <${NOTIFY_FROM}>`,
    `To: ${NOTIFY_TO}`,
    `Subject: New MEMOVA waitlist signup: ${email}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    "New MEMOVA waitlist signup",
    "",
    `Email: ${email}`,
    `Source: ${safeSource}`,
    `Submitted: ${createdAt}`,
    "",
    "This signup has also been stored in the Cloudflare D1 memova_waitlist database.",
  ].join("\r\n");
}

async function notify(env, email, createdAt, source) {
  if (!env.WAITLIST_EMAIL) {
    return { sent: false, error: "WAITLIST_EMAIL binding is not configured" };
  }

  const text = [
    "New MEMOVA waitlist signup",
    "",
    `Email: ${email}`,
    `Source: ${source || "memova.ai"}`,
    `Submitted: ${createdAt}`,
    "",
    "This signup has also been stored in the Cloudflare D1 memova_waitlist database.",
  ].join("\n");

  try {
    await env.WAITLIST_EMAIL.send({
      to: NOTIFY_TO,
      from: NOTIFY_FROM,
      subject: `New MEMOVA waitlist signup: ${email}`,
      text,
    });
    return { sent: true, error: null };
  } catch {
    // Fall back to the Email Routing style API.
  }

  const message = new EmailMessage(
    NOTIFY_FROM,
    NOTIFY_TO,
    buildEmail(email, createdAt, source)
  );

  await env.WAITLIST_EMAIL.send(message);
  return { sent: true, error: null };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return json({ ok: true });
    }

    if (url.pathname !== "/api/waitlist" || request.method !== "POST") {
      return json({ ok: false, error: "not_found" }, { status: 404 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "invalid_json" }, { status: 400 });
    }

    const email = normalizeEmail(body.email);
    const source = String(body.source || "memova.ai").slice(0, 120);
    if (!isValidEmail(email)) {
      return json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const userAgent = (request.headers.get("user-agent") || "").slice(0, 500);
    const ip = request.headers.get("cf-connecting-ip") || "";
    const ipHash = ip ? await sha256(ip) : null;

    const existing = await env.DB.prepare(
      "SELECT id, email_sent FROM waitlist WHERE email = ?"
    )
      .bind(email)
      .first();
    const created = !existing;
    const shouldNotify = created || existing.email_sent !== 1;

    await env.DB.prepare(
      `INSERT INTO waitlist (email, source, user_agent, ip_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         source = excluded.source,
         user_agent = excluded.user_agent,
         ip_hash = excluded.ip_hash,
         updated_at = excluded.updated_at`
    )
      .bind(email, source, userAgent, ipHash, now, now)
      .run();

    let emailStatus = { sent: false, error: null };
    if (shouldNotify) {
      try {
        emailStatus = await notify(env, email, now, source);
      } catch (error) {
        emailStatus = { sent: false, error: String(error?.message || error).slice(0, 500) };
      }

      await env.DB.prepare(
        "UPDATE waitlist SET email_sent = ?, email_error = ? WHERE email = ?"
      )
        .bind(emailStatus.sent ? 1 : 0, emailStatus.error, email)
        .run();
    }

    return json({
      ok: true,
      status: created ? "joined" : "updated",
      emailSent: emailStatus.sent,
    });
  },
};
