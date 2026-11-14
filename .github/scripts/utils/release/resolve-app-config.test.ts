import { describe, expect, it } from "bun:test";

import { resolveAppConfig } from "./resolve-app-config";

describe("resolveAppConfig", () => {
  const config = {
    web: {
      dokploy: { production: "prod-id", staging: "staging-id" },
      phase: { appId: "phase-id" },
    },
    backend: { dokploy: { production: "prod-id" } },
    draft: {
      dokploy: { production: "REPLACE_ME", staging: "staging-id" },
      phase: { appId: "REPLACE_ME_PHASE" },
    },
  };

  it("should resolve the ids of the environment", () => {
    expect(
      resolveAppConfig({ config, app: "web", environment: "staging" }),
    ).toEqual({ dokployComposeId: "staging-id", phaseAppId: "phase-id" });
  });

  it("should leave the Phase app id empty when the app needs none", () => {
    expect(
      resolveAppConfig({ config, app: "backend", environment: "production" })
        .phaseAppId,
    ).toBe("");
  });

  it("should fail for an unknown app", () => {
    expect(() =>
      resolveAppConfig({ config, app: "nope", environment: "production" }),
    ).toThrow("No release config for 'nope'.");
  });

  it("should fail for a missing environment", () => {
    expect(() =>
      resolveAppConfig({ config, app: "backend", environment: "staging" }),
    ).toThrow("compose id of 'backend' for staging is missing");
  });

  it("should report every placeholder at once", () => {
    expect(() =>
      resolveAppConfig({ config, app: "draft", environment: "production" }),
    ).toThrow(
      /compose id of 'draft'.*Phase app id of 'draft' is still the placeholder/,
    );
  });
});
