import { describe, expect, it } from "vitest";

import {
  REQUIRED_TRACKED_PATHS,
  findProductionSourceViolations,
} from "../../../scripts/verify-production-source.mjs";

const allRequiredPaths = new Set([
  "client/public/odmpartnership/index.html",
  "client/public/team/weilijiang/index.html",
  "client/public/_headers",
  "client/public/_redirects",
]);

describe("findProductionSourceViolations", () => {
  it("accepts a clean source when every required page is tracked", () => {
    expect(findProductionSourceViolations("", allRequiredPaths)).toEqual([]);
  });

  it("rejects an untracked public page", () => {
    expect(
      findProductionSourceViolations(
        "?? client/public/odmpartnership/index.html\n",
        allRequiredPaths,
      ),
    ).toContain(
      "Dirty production input: ?? client/public/odmpartnership/index.html",
    );
  });

  it("rejects modified and renamed production inputs", () => {
    expect(
      findProductionSourceViolations(
        " M client/public/_headers\nR  client/public/old.html -> client/public/new.html\n",
        allRequiredPaths,
      ),
    ).toEqual(
      expect.arrayContaining([
        "Dirty production input:  M client/public/_headers",
        "Dirty production input: R  client/public/old.html -> client/public/new.html",
      ]),
    );
  });

  it("rejects missing required tracked paths", () => {
    const violations = findProductionSourceViolations("", new Set());

    for (const requiredPath of REQUIRED_TRACKED_PATHS) {
      expect(violations).toContain(
        `Required tracked path is missing: ${requiredPath}`,
      );
    }
  });
});
