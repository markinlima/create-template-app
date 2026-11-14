import { describe, expect, it } from "bun:test";

import { parseAffectedPackages } from "./parse-affected-packages";

describe("parseAffectedPackages", () => {
  it("should return the unique, sorted package names", () => {
    expect(
      parseAffectedPackages({
        data: {
          affectedTasks: {
            items: [
              { package: { name: "web" } },
              { package: { name: "backend" } },
              { package: { name: "web" } },
            ],
          },
        },
      }),
    ).toEqual(["backend", "web"]);
  });

  it("should return nothing for an empty answer", () => {
    expect(parseAffectedPackages({})).toEqual([]);
  });
});
