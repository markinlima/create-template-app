import { describe, expect, it } from "bun:test";

import { storageEnvSchema } from "../../src/backend";
import { storageEnv } from "../utils/fixtures";
import { failedKeys } from "../utils/parse";

describe("storageEnvSchema", () => {
  it("should accept a complete environment", () => {
    expect(failedKeys(storageEnvSchema, storageEnv)).toEqual([]);
  });

  it.each(Object.keys(storageEnv))("should require %s", (key) => {
    expect(
      failedKeys(storageEnvSchema, { ...storageEnv, [key]: undefined }),
    ).toEqual([key]);
  });
});
