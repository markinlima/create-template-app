import { describe, expect, it } from "bun:test";

import { buildComposeArgs } from "./build-compose-args";

describe("buildComposeArgs", () => {
  it("gives just the command when there is no file and no profile", () => {
    expect(buildComposeArgs({ args: ["up", "-d"] })).toEqual([
      "compose",
      "up",
      "-d",
    ]);
  });

  it("puts the file, then each profile, then the command", () => {
    expect(
      buildComposeArgs({
        file: "./docker-compose.test.yml",
        profiles: ["backend-test", "services"],
        args: ["build"],
      }),
    ).toEqual([
      "compose",
      "-f",
      "./docker-compose.test.yml",
      "--profile",
      "backend-test",
      "--profile",
      "services",
      "build",
    ]);
  });
});
