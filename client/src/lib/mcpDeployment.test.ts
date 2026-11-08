import { describe, expect, it } from "vitest";
import { resolveMcpDeployment } from "../../../shared/mcpDeployment";
import { onRequest } from "../../../functions/_middleware.js";

const production = {
  VITE_API_BASE_URL: "https://api.memova.ai",
  VITE_MCP_API_BASE_URL: "https://api.memova.ai",
  VITE_MCP_SERVER_URL: "https://api.memova.ai/v2/mcp",
  VITE_MCP_ENVIRONMENT: "production",
};

describe("MCP deployment boundaries", () => {
  it("requires the account, authorization and resource to share the selected authority", () => {
    expect(resolveMcpDeployment(production).serverUrl).toBe(
      production.VITE_MCP_SERVER_URL
    );
    for (const field of [
      "VITE_API_BASE_URL",
      "VITE_MCP_API_BASE_URL",
      "VITE_MCP_SERVER_URL",
      "VITE_MCP_ENVIRONMENT",
    ]) {
      expect(() =>
        resolveMcpDeployment({ ...production, [field]: "" })
      ).toThrow();
      expect(() =>
        resolveMcpDeployment({
          ...production,
          [field]: "https://other.example",
        })
      ).toThrow();
    }
  });

  it("never derives a legacy endpoint or silently selects a test environment", () => {
    expect(resolveMcpDeployment({})).toMatchObject({
      environment: "unspecified",
      serverUrl: "",
    });
    expect(() =>
      resolveMcpDeployment({
        ...production,
        VITE_MCP_SERVER_URL: "https://api.memova.ai/mcp/next",
      })
    ).toThrow();
    const testOrigin =
      "https://memova-next-mcp-test-api.salmonbeach-7b03b3f7.japaneast.azurecontainerapps.io";
    expect(
      resolveMcpDeployment({
        VITE_MCP_ENVIRONMENT: "isolated-test",
        VITE_API_BASE_URL: testOrigin,
        VITE_MCP_API_BASE_URL: testOrigin,
        VITE_MCP_SERVER_URL: testOrigin + "/v2/mcp",
      }).environment
    ).toBe("isolated-test");
  });

  it("keeps the complete authorization query on the canonical website origin", async () => {
    const url =
      "https://www.memova.ai/mcp/oauth/consent?request_id=sample%2Bid&lang=zh";
    const result = await onRequest({
      request: new Request(url),
      next: () => new Response("next"),
    });
    expect(result.status).toBe(307);
    expect(result.headers.get("location")).toBe(
      url.replace("www.memova.ai", "memova.ai")
    );
    expect(result.headers.get("cache-control")).toBe("no-store");
    expect(result.headers.get("referrer-policy")).toBe("no-referrer");
  });

  it("serves existing marketing, localhost and apex routes normally", async () => {
    for (const url of [
      "https://www.memova.ai/journal/",
      "https://memova.ai/mcp/setup",
      "http://localhost:4200/mcp/setup",
    ]) {
      const result = await onRequest({
        request: new Request(url),
        next: () => new Response("next"),
      });
      expect(await result.text()).toBe("next");
    }
  });
});
