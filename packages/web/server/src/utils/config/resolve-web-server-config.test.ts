import { describe, expect, it } from "bun:test";

import { resolveWebServerConfig } from "./resolve-web-server-config";

describe("resolveWebServerConfig", () => {
  it("gives the defaults to an empty config", () => {
    expect(resolveWebServerConfig({})).toEqual({
      securityHeaders: {},
      cacheRules: [],
      defaultCacheControl: "no-cache",
      notFoundPrefixes: ["/assets/"],
      preloadMaxBytes: 5 * 1024 * 1024,
      spaFallback: true,
      api: undefined,
    });
    expect(resolveWebServerConfig()).toEqual(resolveWebServerConfig({}));
  });

  it("keeps what the app says", () => {
    const resolved = resolveWebServerConfig({
      securityHeaders: { "X-Test": "yes" },
      cacheRules: [{ match: "/a/", cacheControl: "x" }],
      defaultCacheControl: "public, max-age=300",
      notFoundPrefixes: ["/files/"],
      preloadMaxBytes: 10,
      spaFallback: false,
    });

    expect(resolved).toMatchObject({
      securityHeaders: { "X-Test": "yes" },
      cacheRules: [{ match: "/a/", cacheControl: "x" }],
      defaultCacheControl: "public, max-age=300",
      notFoundPrefixes: ["/files/"],
      preloadMaxBytes: 10,
      spaFallback: false,
    });
  });

  it("runs the functions of the config, so they can read the environment of the server", () => {
    const resolved = resolveWebServerConfig({
      securityHeaders: () => ({ "X-From": "function" }),
      api: { url: () => "https://api.test", version: () => "2" },
    });

    expect(resolved.securityHeaders).toEqual({ "X-From": "function" });
    expect(resolved.api).toMatchObject({
      url: "https://api.test",
      version: "2",
    });
  });

  it("gives the defaults of the API", () => {
    expect(
      resolveWebServerConfig({ api: { url: "https://api.test" } }).api,
    ).toEqual({
      url: "https://api.test",
      version: undefined,
      headers: {},
      timeoutMs: 5000,
      missingStatuses: [401, 403, 404],
    });
  });
});
