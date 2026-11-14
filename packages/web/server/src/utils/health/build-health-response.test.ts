import { describe, expect, it } from "bun:test";

import type { PublicFile } from "../../types/public-file";
import { buildHealthResponse } from "./build-health-response";

const files = new Map([
  ["/index.html", {} as PublicFile],
  ["/about-us", {} as PublicFile],
]);

describe("buildHealthResponse", () => {
  it("is healthy once the build is loaded in memory, and never cached", async () => {
    const response = await buildHealthResponse(async () => files);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("ok");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("is not healthy while the build has no index.html", async () => {
    const response = await buildHealthResponse(
      async () => new Map([["/about-us", {} as PublicFile]]),
    );

    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("is not healthy when the build can't be loaded", async () => {
    const response = await buildHealthResponse(async () => {
      throw new Error("no such directory");
    });

    expect(response.status).toBe(503);
  });
});
