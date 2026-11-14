import { describe, expect, it } from "bun:test";

import { buildReleaseConfig } from "./build-release-config";

describe("buildReleaseConfig", () => {
  it("should key the release ids by project id", () => {
    expect(
      buildReleaseConfig({
        projects: [
          { id: "backend", dokploy: { production: "prod-id" } },
          {
            id: "web",
            dokploy: { staging: "staging-id" },
            phase: { appId: "phase-id" },
          },
        ],
      }),
    ).toEqual({
      backend: { dokploy: { production: "prod-id" }, phase: undefined },
      web: { dokploy: { staging: "staging-id" }, phase: { appId: "phase-id" } },
    });
  });

  it("should keep a project without release ids as an empty entry", () => {
    expect(buildReleaseConfig({ projects: [{ id: "worker" }] })).toEqual({
      worker: { dokploy: undefined, phase: undefined },
    });
  });
});
