import { beforeEach, describe, expect, it, mock } from "bun:test";

const useRuntimeConfig = mock<() => Record<string, unknown>>();

mock.module("nitro/runtime-config", () => ({ useRuntimeConfig }));

const { getServerEnv } = await import("./get-server-env");

describe("getServerEnv", () => {
  beforeEach(() => {
    useRuntimeConfig.mockReset();
  });

  it("gives the envs the app put in the runtime config", () => {
    useRuntimeConfig.mockReturnValue({
      env: { VITE_API_URL: "https://api.test" },
    });

    expect(getServerEnv<{ VITE_API_URL: string }>().VITE_API_URL).toBe(
      "https://api.test",
    );
  });

  it("says what to do when the app gave no env", () => {
    useRuntimeConfig.mockReturnValue({});

    expect(() => getServerEnv()).toThrow("give `env` to `webServer()`");
  });
});
