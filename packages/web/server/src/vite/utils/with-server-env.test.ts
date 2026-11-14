import { describe, expect, it } from "bun:test";

import { withServerEnv } from "./with-server-env";

describe("withServerEnv", () => {
  it("sets the envs in the runtime config, keeping the rest of it", () => {
    expect(
      withServerEnv({ runtimeConfig: { other: 1 } }, { VITE_API_URL: "a" }),
    ).toEqual({ runtimeConfig: { other: 1, env: { VITE_API_URL: "a" } } });
  });

  it("changes nothing when the app gives no env", () => {
    expect(withServerEnv({ serverDir: "./server" })).toEqual({
      serverDir: "./server",
    });
  });

  it("accepts the values of a parsed schema, such as booleans", () => {
    expect(withServerEnv({}, { VITE_DEBUG_MODE: false }).runtimeConfig).toEqual(
      { env: { VITE_DEBUG_MODE: false } },
    );
  });
});
