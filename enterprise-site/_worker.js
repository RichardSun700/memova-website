export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname === "/api/contact") {
      if (!env.CONTACT_API)
        return new Response(
          JSON.stringify({ ok: false, error: "unavailable" }),
          {
            status: 503,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
            },
          }
        );
      return env.CONTACT_API.fetch(request);
    }
    return env.ASSETS.fetch(request);
  },
};
