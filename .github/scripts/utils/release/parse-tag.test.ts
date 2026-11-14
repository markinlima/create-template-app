import { describe, expect, it } from "bun:test";

import { parseTag } from "./parse-tag";

describe("parseTag", () => {
  it("should parse a final release from main", () => {
    expect(parseTag("web-v1.2.3")).toEqual({
      app: "web",
      version: "1.2.3",
      isRc: false,
      environment: "production",
      branch: "main",
    });
  });

  it("should parse a release candidate from staging", () => {
    expect(parseTag("moderation-v1.0.0-rc2")).toEqual({
      app: "moderation",
      version: "1.0.0-rc2",
      isRc: true,
      environment: "staging",
      branch: "staging",
    });
  });

  it("should accept an app name with dashes", () => {
    expect(parseTag("admin-panel-v0.1.0").app).toBe("admin-panel");
  });

  it("should reject tags outside the pattern", () => {
    for (const tag of [
      "web-1.0.0",
      "v1.0.0",
      "web-v1.0",
      "Web-v1.0.0",
      "web-v1.0.0-rc",
      "web-v1.0.0-beta1",
      "web--v1.0.0",
    ]) {
      expect(() => parseTag(tag)).toThrow(`Tag '${tag}' is not valid.`);
    }
  });
});
