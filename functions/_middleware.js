export async function onRequest(context) {
  const url = new URL(context.request.url);
  const accountRoute =
    /^\/(?:login|profile|connected-clients|settings\/connected-clients|mcp)(?:\/|$)/.test(url.pathname);
  if (
    url.hostname === "www.memova.ai" &&
    accountRoute &&
    ["GET", "HEAD"].includes(context.request.method)
  ) {
    url.hostname = "memova.ai";
    return new Response(null, {
      status: 307,
      headers: {
        Location: url.href,
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
      },
    });
  }
  return context.next();
}
