import { afterEach, describe, expect, it, vi } from "vitest";
import {
  normalizeLoginReturnPath,
  readEmailLoginFlow,
  saveEmailLoginFlow,
  safeClientWebsite,
} from "./loginFlow";

afterEach(() => vi.unstubAllGlobals());

describe("MCP login flow boundaries", () => {
  it("preserves a legitimate consent request exactly and allows account routes", () => {
    const path = "/mcp/oauth/consent?request_id=fixture-request&lang=zh";
    expect(normalizeLoginReturnPath(path)).toBe(path);
    expect(normalizeLoginReturnPath("/connected-clients?lang=zh")).toBe(
      "/connected-clients?lang=zh"
    );
  });

  it("rejects external, encoded, backslash and unrecognized return routes", () => {
    for (const path of [
      "https://elsewhere.example/",
      "//elsewhere.example/",
      "/\\elsewhere.example",
      "/%2felsewhere.example",
      "/%255celsewhere.example",
      "/mcp/../login",
      "/mcp/oauth/consent\n",
      "/mcp/oauth/consent?request_id=%255c",
      "/unknown",
    ]) {
      expect(normalizeLoginReturnPath(path)).toBe("/profile");
    }
  });

  it("keeps refresh recovery scoped to backend and request without storing an OTP", () => {
    const storage = new Map<string, string>();
    vi.stubGlobal("window", {
      sessionStorage: {
        getItem: (k: string) => storage.get(k),
        setItem: (k: string, v: string) => storage.set(k, v),
        removeItem: (k: string) => storage.delete(k),
      },
    });
    saveEmailLoginFlow(
      "production:https://api.memova.ai",
      "/mcp/oauth/consent?request_id=one",
      {
        email: "person@example.com",
        resendAt: Date.now() + 60000,
        challenge: {
          challenge_id: "fixture-challenge",
          expires_at: new Date(Date.now() + 120000).toISOString(),
          delivery_channel: "email",
          dev_code: "123456",
        },
      }
    );
    expect(
      readEmailLoginFlow(
        "production:https://api.memova.ai",
        "/mcp/oauth/consent?request_id=one"
      )?.challenge.challenge_id
    ).toBe("fixture-challenge");
    expect(
      readEmailLoginFlow(
        "isolated-test:https://test.example",
        "/mcp/oauth/consent?request_id=one"
      )
    ).toBeNull();
    expect(
      readEmailLoginFlow(
        "production:https://api.memova.ai",
        "/mcp/oauth/consent?request_id=two"
      )
    ).toBeNull();
    expect([...storage.values()].join()).not.toContain("123456");
  });

  it("rejects client metadata URLs that could execute code or include credentials", () => {
    expect(safeClientWebsite("javascript:alert(1)")).toBeUndefined();
    expect(
      safeClientWebsite("https://person:password@example.com")
    ).toBeUndefined();
    expect(safeClientWebsite("https://example.com/client")).toBe(
      "https://example.com/client"
    );
  });
});
