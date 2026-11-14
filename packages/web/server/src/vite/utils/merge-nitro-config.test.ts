import { describe, expect, it } from "bun:test";

import { mergeNitroConfig } from "./merge-nitro-config";

describe("mergeNitroConfig", () => {
  it("gives the defaults of the server when the app gives nothing", () => {
    expect(mergeNitroConfig()).toEqual({
      preset: "bun",
      serveStatic: false,
      renderer: false,
    });
  });

  it("keeps the options of the app next to the defaults", () => {
    expect(mergeNitroConfig({ serverDir: "./server" })).toMatchObject({
      preset: "bun",
      serverDir: "./server",
    });
  });

  it("lets the app override a default, such as the renderer in development", () => {
    expect(
      mergeNitroConfig({ renderer: { template: "./index.html" } }).renderer,
    ).toEqual({ template: "./index.html" });
  });

  it("keeps the default of an option the app sets to undefined", () => {
    expect(mergeNitroConfig({ renderer: undefined }).renderer).toBe(false);
  });
});
