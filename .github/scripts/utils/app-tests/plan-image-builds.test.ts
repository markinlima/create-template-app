import { describe, expect, it } from "bun:test";

import type { ComposeConfig } from "../../types/compose-config";
import { planImageBuilds } from "./plan-image-builds";

const config: ComposeConfig = {
  name: "app-web-test",
  services: {
    postgres: {},
    "tests-runner": {
      image: "app-web-test:latest",
      build: {
        context: "/repo",
        dockerfile: "./apps/web/dockerfile",
        target: "test",
        pull: true,
      },
    },
    "build-secret": {
      build: {
        context: "/repo",
        dockerfile: "./apps/web/dockerfile",
        target: "production",
        args: { MODE: "ci", FLAG: null },
        secrets: [{ source: "build-env" }],
      },
    },
  },
  secrets: { "build-env": { file: "/repo/apps/web/.env.test" } },
};

describe("planImageBuilds", () => {
  it("should build every service that has a build section", () => {
    const builds = planImageBuilds(config);

    expect(builds.map((build) => build.service)).toEqual([
      "build-secret",
      "tests-runner",
    ]);
  });

  it("should mirror the compose build with a plain docker build", () => {
    const [, runner] = planImageBuilds(config);

    expect(runner?.image).toBe("app-web-test:latest");
    expect(runner?.args).toEqual([
      "build",
      "--tag",
      "app-web-test:latest",
      "--file",
      "/repo/apps/web/dockerfile",
      "--target",
      "test",
      "--pull",
      "/repo",
    ]);
  });

  it("should name an image like compose and pass build args and secrets", () => {
    const [withSecret] = planImageBuilds(config);

    expect(withSecret?.image).toBe("app-web-test-build-secret");
    expect(withSecret?.args).toContain("MODE=ci");
    expect(withSecret?.args).toContain("FLAG");
    expect(withSecret?.args).toContain(
      "id=build-env,src=/repo/apps/web/.env.test",
    );
    expect(withSecret?.args).not.toContain("--cache-from");
    expect(withSecret?.args).not.toContain("--load");
    expect(withSecret?.args[0]).toBe("build");
  });

  it("should fail when a build secret has no file", () => {
    expect(() => planImageBuilds({ ...config, secrets: {} })).toThrow(
      "Secret 'build-env' of service 'build-secret' has no file.",
    );
  });
});
