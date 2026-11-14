import { describe, expect, it } from "bun:test";

import { buildTestStackEnv } from "./build-test-stack-env";

describe("buildTestStackEnv", () => {
  it("gives the stack a network of its own, named for the app, that is not the external one", () => {
    const env = buildTestStackEnv("backend", "test:unit");

    expect(env.DEV_NET).toBe("backend-test");
    expect(env.DEV_NET_EXTERNAL).toBe("false");
  });

  it("passes the script to run and the database of the tests", () => {
    const env = buildTestStackEnv("web", "test:all");

    expect(env.TEST_TARGET).toBe("test:all");
    expect(env.POSTGRES_DB).toBe("app_test");
  });
});
