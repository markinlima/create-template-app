import { describe, expect, it } from "bun:test";

import type { Workspace } from "../../types/workspace";
import { selectTargets } from "./select-targets";

const workspaces: Workspace[] = [
  {
    name: "backend",
    path: "apps/backend",
    scripts: {
      "docker:test": "compose up",
      "test:integration": "x",
      "test:e2e": "x",
    },
  },
  {
    name: "moderation",
    path: "workers/moderation",
    scripts: { "docker:test": "compose up", "test:unit": "x" },
  },
  {
    name: "@shared/utils",
    path: "packages/shared/utils",
    scripts: { "test:unit": "x" },
  },
];

describe("selectTargets", () => {
  it("should keep only apps with a Docker test stack and the suites they have", () => {
    expect(
      selectTargets({ workspaces, suites: ["unit", "integration", "e2e"] }),
    ).toEqual([
      { name: "backend", path: "apps/backend", suites: "integration,e2e" },
      { name: "moderation", path: "workers/moderation", suites: "unit" },
    ]);
  });

  it("should drop an app that has none of the requested suites", () => {
    expect(selectTargets({ workspaces, suites: ["unit"] })).toEqual([
      { name: "moderation", path: "workers/moderation", suites: "unit" },
    ]);
  });

  it("should restrict to the given names", () => {
    expect(
      selectTargets({ workspaces, names: ["backend"], suites: ["e2e"] }),
    ).toEqual([{ name: "backend", path: "apps/backend", suites: "e2e" }]);
  });

  it("should reject an unknown app or suite", () => {
    expect(() =>
      selectTargets({ workspaces, names: ["nope"], suites: ["unit"] }),
    ).toThrow("Unknown workspace(s): nope");
    expect(() => selectTargets({ workspaces, suites: ["smoke"] })).toThrow(
      "Unknown suite(s): smoke",
    );
  });
});
