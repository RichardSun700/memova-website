const allowedOrigins = new Set(["https://enterprise.memova.ai"]);
const categories = new Set([
  "",
  "knowledge",
  "data",
  "models",
  "industrial",
  "other",
]);
const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const notifyTo = "richard@memova.ai";
const notifyFrom = "noreply@memova.ai";
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });

export function validateInquiry(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const {
    name,
    email,
    company = "",
    category = "",
    message,
    language,
    requestId,
    website = "",
  } = body;
  if (
    [
      name,
      email,
      company,
      category,
      message,
      language,
      requestId,
      website,
    ].some(value => typeof value !== "string")
  )
    return null;
  if (!name.trim() || name.trim().length > 100 || /[\r\n\x00-\x1f]/.test(name))
    return null;
  if (
    email.length > 254 ||
    !/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(email.trim())
  )
    return null;
  if (
    company.length > 160 ||
    /[\r\n\x00-\x1f]/.test(company) ||
    !categories.has(category)
  )
    return null;
  if (
    message.trim().length < 10 ||
    message.length > 3000 ||
    message.includes("\0")
  )
    return null;
  if (
    !["en", "zh"].includes(language) ||
    !uuid.test(requestId) ||
    website.length > 200
  )
    return null;
  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    company: company.trim(),
    category,
    message: message.trim(),
    language,
    requestId,
    spam: !!website,
  };
}

export async function deliverNotification(
  db,
  send,
  id,
  now = Math.floor(Date.now() / 1000)
) {
  const lead = await db
    .prepare(
      `UPDATE enterprise_leads SET notification_state='sending', notification_lease_until=?, notification_attempts=notification_attempts+1
    WHERE id=? AND notification_attempts<5 AND ((notification_state IN ('queued','failed') AND notification_next_at<=?) OR (notification_state='sending' AND notification_lease_until<=?)) RETURNING *`
    )
    .bind(now + 120, id, now, now)
    .first();
  if (!lead) return;
  try {
    await send({
      to: notifyTo,
      from: notifyFrom,
      replyTo: lead.email,
      subject: `Memova enterprise inquiry ${lead.id}`,
      text: [
        "New Memova enterprise inquiry",
        `Reference: ${lead.id}`,
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Company: ${lead.company || "Not provided"}`,
        `Interest: ${lead.category || "Not specified"}`,
        `Language: ${lead.language}`,
        `Received: ${new Date(lead.created_at * 1000).toISOString()}`,
        "",
        "Project details:",
        lead.message,
        "",
        "Stored separately from the consumer waitlist.",
      ].join("\n"),
    });
    await db
      .prepare(
        "UPDATE enterprise_leads SET notification_state='sent', notification_error=NULL, notification_lease_until=0 WHERE id=?"
      )
      .bind(id)
      .run();
  } catch {
    await db
      .prepare(
        "UPDATE enterprise_leads SET notification_state='failed', notification_error='notification_send_failed', notification_next_at=?, notification_lease_until=0 WHERE id=?"
      )
      .bind(now + Math.min(3600, 60 * 2 ** lead.notification_attempts), id)
      .run();
  }
}

export function createContactWorker(sendNotification) {
  return {
    async fetch(request, env, ctx) {
      if (new URL(request.url).pathname !== "/api/contact")
        return json({ ok: false, error: "not_found" }, 404);
      if (request.method !== "POST")
        return json({ ok: false, error: "method_not_allowed" }, 405);
      if (!allowedOrigins.has(request.headers.get("Origin")))
        return json({ ok: false, error: "invalid_origin" }, 403);
      if (!request.headers.get("Content-Type")?.startsWith("application/json"))
        return json({ ok: false, error: "unsupported_type" }, 415);
      if (Number(request.headers.get("Content-Length") || 0) > 16000)
        return json({ ok: false, error: "too_large" }, 413);
      let body;
      try {
        const reader = request.body.getReader();
        const chunks = [];
        let size = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > 16000) {
            await reader.cancel();
            return json({ ok: false, error: "too_large" }, 413);
          }
          chunks.push(value);
        }
        const bytes = new Uint8Array(size);
        let offset = 0;
        for (const part of chunks) {
          bytes.set(part, offset);
          offset += part.length;
        }
        body = JSON.parse(new TextDecoder().decode(bytes));
      } catch {
        return json({ ok: false, error: "invalid_json" }, 400);
      }
      const lead = validateInquiry(body);
      if (!lead) return json({ ok: false, error: "invalid_fields" }, 400);
      if (lead.spam) return json({ ok: false, error: "invalid_fields" }, 400);
      if (!env.DB) return json({ ok: false, error: "unavailable" }, 503);
      const now = Math.floor(Date.now() / 1000);
      try {
        const existing = await env.DB.prepare(
          "SELECT * FROM enterprise_leads WHERE request_id=?"
        )
          .bind(lead.requestId)
          .first();
        if (existing) {
          if (
            [
              "name",
              "email",
              "company",
              "category",
              "message",
              "language",
            ].some(key => existing[key] !== lead[key])
          )
            return json({ ok: false, error: "request_conflict" }, 409);
          ctx.waitUntil(
            deliverNotification(
              env.DB,
              message => sendNotification(env, message),
              existing.id
            )
          );
          return json({ ok: true, status: "received", reference: existing.id });
        }
        const ip = request.headers.get("CF-Connecting-IP") || "unknown";
        const digest = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(
            `${new Date().toISOString().slice(0, 10)}:${ip}`
          )
        );
        const ipHash = Array.from(new Uint8Array(digest), byte =>
          byte.toString(16).padStart(2, "0")
        ).join("");
        const id = crypto.randomUUID();
        const result = await env.DB.prepare(
          `INSERT INTO enterprise_leads(id,request_id,name,email,company,category,message,language,created_at,ip_hash)
          SELECT ?,?,?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM enterprise_leads WHERE ip_hash=? AND created_at>?)<5 AND (SELECT COUNT(*) FROM enterprise_leads WHERE email=? AND created_at>?)<3
          ON CONFLICT(request_id) DO NOTHING`
        )
          .bind(
            id,
            lead.requestId,
            lead.name,
            lead.email,
            lead.company,
            lead.category,
            lead.message,
            lead.language,
            now,
            ipHash,
            ipHash,
            now - 600,
            lead.email,
            now - 600
          )
          .run();
        if (!result.meta.changes) {
          const retry = await env.DB.prepare(
            "SELECT * FROM enterprise_leads WHERE request_id=?"
          )
            .bind(lead.requestId)
            .first();
          if (
            retry &&
            [
              "name",
              "email",
              "company",
              "category",
              "message",
              "language",
            ].every(key => retry[key] === lead[key])
          )
            return json({ ok: true, status: "received", reference: retry.id });
          return json({ ok: false, error: "rate_limited" }, 429);
        }
        ctx.waitUntil(
          deliverNotification(
            env.DB,
            message => sendNotification(env, message),
            id
          )
        );
        return json({ ok: true, status: "received", reference: id }, 201);
      } catch {
        return json({ ok: false, error: "unavailable" }, 503);
      }
    },
    async scheduled(_controller, env, ctx) {
      const now = Math.floor(Date.now() / 1000);
      const rows = await env.DB.prepare(
        "SELECT id FROM enterprise_leads WHERE notification_attempts<5 AND ((notification_state IN ('queued','failed') AND notification_next_at<=?) OR (notification_state='sending' AND notification_lease_until<=?)) ORDER BY created_at LIMIT 20"
      )
        .bind(now, now)
        .all();
      for (const row of rows.results)
        ctx.waitUntil(
          deliverNotification(
            env.DB,
            message => sendNotification(env, message),
            row.id,
            now
          )
        );
      await env.DB.prepare(
        "UPDATE enterprise_leads SET ip_hash=NULL WHERE ip_hash IS NOT NULL AND created_at<?"
      )
        .bind(now - 7 * 86400)
        .run();
    },
  };
}
