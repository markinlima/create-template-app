import { describe, expect, it } from "bun:test";

import { databaseEnvSchema } from "../../src/backend";
import { databaseEnv } from "../utils/fixtures";
import { failedKeys } from "../utils/parse";

describe("databaseEnvSchema", () => {
  it("should accept a minimal environment", () => {
    expect(failedKeys(databaseEnvSchema, databaseEnv)).toEqual([]);
  });

  it("should require DATABASE_URL", () => {
    expect(failedKeys(databaseEnvSchema, {})).toEqual(["DATABASE_URL"]);
  });

  it("should require DATABASE_URL to be a URL", () => {
    expect(
      failedKeys(databaseEnvSchema, { DATABASE_URL: "not a url" }),
    ).toEqual(["DATABASE_URL"]);
  });
});
