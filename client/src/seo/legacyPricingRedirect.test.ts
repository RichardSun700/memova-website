import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { onRequest } from "../../../functions/_middleware.js";

describe("retired pricing page", () => {
  it("routes every retired alias through the redirect middleware in production", () => {
    const routes = JSON.parse(fs.readFileSync("client/public/_routes.json", "utf8"));
    expect(routes.include).toEqual(expect.arrayContaining([
      "/pricing", "/pricing/", "/pricing/index.html", "/pricing.html",
    ]));
    expect(routes.exclude).toEqual([]);
  });

  it.each(["/pricing", "/pricing/", "/pricing/index.html", "/pricing.html"])(
    "permanently redirects %s to the homepage Pro section, preserving language and attribution",
    async pathname => {
      for (const method of ["GET", "HEAD"]) {
        const next = vi.fn();
        const result = await onRequest({
          request: new Request(`https://memova.ai${pathname}?lang=zh&utm_source=old%2Bprice`, { method }),
          next,
        });
        expect(result.status).toBe(301);
        expect(new URL(result.headers.get("location")!, "https://memova.ai").href).toBe(
          "https://memova.ai/?lang=zh&utm_source=old%2Bprice#pro"
        );
        expect(await result.text()).toBe("");
        expect(next).not.toHaveBeenCalled();
      }
    }
  );

  it("keeps unrelated routes and pricing assets available", async () => {
    for (const pathname of ["/", "/journal/", "/pricing/pricing.css", "/pricing-other"]) {
      const result = await onRequest({
        request: new Request(`https://memova.ai${pathname}`),
        next: () => new Response("next"),
      });
      expect(result.status).toBe(200);
      expect(await result.text()).toBe("next");
    }
  });
});
