import { describe, expect, it } from "bun:test";

import { validateAppConfig } from "./config";

describe("validateAppConfig", () => {
  it("accepts an app with an entry", () => {
    expect(
      validateAppConfig(
        { web: { dokploy: { staging: "a", production: "b" } } },
        "web",
      ),
    ).toEqual([]);
  });

  it("refuses an app without an entry, and an entry with a placeholder left, however deep", () => {
    expect(validateAppConfig({ web: {} }, "backend")[0]).toContain("no entry");
    expect(
      validateAppConfig(
        { web: { dokploy: { staging: "REPLACE_ME" } } },
        "web",
      )[0],
    ).toContain("REPLACE_ME");
  });
});
