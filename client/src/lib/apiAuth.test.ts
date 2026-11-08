import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ApiError,
  getCurrentUser,
  logoutSession,
  startEmailLogin,
  subscribeToUnauthorized,
  verifyEmailLogin,
} from "./api";

afterEach(() => vi.unstubAllGlobals());

describe("Python website API contract", () => {
  it("preserves business error codes, request IDs and resend limits", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            JSON.stringify({
              error: {
                code: "auth.rate_limited",
                message: "Please wait.",
                details: { field: "email" },
              },
            }),
            {
              status: 429,
              headers: {
                "x-request-id": "request-fixture",
                "retry-after": "30",
              },
            }
          )
        )
    );
    await expect(startEmailLogin("person@example.com")).rejects.toMatchObject({
      status: 429,
      code: "auth.rate_limited",
      message: "Please wait.",
      requestId: "request-fixture",
      retryAfterSeconds: 30,
    });
  });

  it("handles OAuth string errors without applying a Java response envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            JSON.stringify({
              error: "invalid_request",
              error_description: "This request has expired.",
            }),
            { status: 400 }
          )
        )
    );
    await expect(startEmailLogin("person@example.com")).rejects.toMatchObject({
      code: "invalid_request",
      message: "This request has expired.",
    });
  });

  it("notifies the active session on authenticated 401 and keeps network failures separate", async () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToUnauthorized(listener);
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Offline"))
      .mockResolvedValueOnce(
        new Response(
          '{"error":{"code":"auth.expired","message":"Sign in again."}}',
          { status: 401 }
        )
      );
    vi.stubGlobal("fetch", fetch);
    await expect(getCurrentUser("fixture-token")).rejects.toMatchObject({
      status: 0,
    });
    expect(listener).not.toHaveBeenCalled();
    await expect(getCurrentUser("fixture-token")).rejects.toBeInstanceOf(
      ApiError
    );
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith("fixture-token");
    unsubscribe();
  });

  it("accepts an empty logout response and sends only the user-entered OTP with web context", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(new Response('{"access_token":"fixture"}'));
    vi.stubGlobal("fetch", fetch);
    await expect(logoutSession("fixture-token")).resolves.toBeUndefined();
    expect(fetch.mock.calls[0][1].body).toBeUndefined();
    await verifyEmailLogin("challenge-fixture", "123456");
    const request = fetch.mock.calls[1];
    expect(request[0]).not.toContain("123456");
    expect(JSON.parse(request[1].body)).toMatchObject({
      challenge_id: "challenge-fixture",
      code: "123456",
      client_context: { surface: "web" },
    });
    expect(JSON.parse(request[1].body)).not.toHaveProperty("invite_code");
  });
});
