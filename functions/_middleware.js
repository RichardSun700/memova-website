export async function onRequest(context) {
  const url = new URL(context.request.url);
  // Pages middleware handles this redirect so it can retain the full query.
  if (["/pricing", "/pricing/", "/pricing/index.html", "/pricing.html"].includes(url.pathname)) {
    return new Response(null, {
      status: 301,
      headers: { Location: `/${url.search}#pro` },
    });
  }
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
