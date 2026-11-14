import { describe, expect, it, spyOn } from "bun:test";

import { z } from "zod";

import { buildMeta } from "@web/seo/head";

import { buildHeadRouteResponse } from "./build-head-route-response";

const shell =
  "<!doctype html><html><head><title>Site</title></head><body></body></html>";
const api = { get: async () => null };
const securityHeaders = { "x-content-type-options": "nosniff" };
const request = new Request("https://site.test/post/1");

const route = {
  params: z.object({ id: z.string().min(1) }),
  load: async ({ params }: { params: { id: string } }) =>
    params.id === "1" ? { title: "Página boa" } : null,
  tags: (content: { title: string }) => buildMeta({ title: content.title }),
};

function respond(
  overrides: Partial<Parameters<typeof buildHeadRouteResponse>[0]> = {},
) {
  return buildHeadRouteResponse({
    route,
    request,
    rawParams: { id: "1" },
    shell,
    securityHeaders,
    api,
    ...overrides,
  } as Parameters<typeof buildHeadRouteResponse>[0]);
}

describe("buildHeadRouteResponse", () => {
  it("gives the shell with the tags of the content, not indexable and kept an hour by default", async () => {
    const response = await respond();

    expect(await response.text()).toContain("Página boa");
    expect(response.headers.get("cache-control")).toBe("public, max-age=3600");
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it("takes the cache rule and the indexing of the route", async () => {
    const response = await respond({
      route: {
        ...route,
        indexable: true,
        cacheControl: "public, s-maxage=60",
      },
    } as never);

    expect(response.headers.get("cache-control")).toBe("public, s-maxage=60");
    expect(response.headers.get("x-robots-tag")).toBeNull();
  });

  it("gives the shell with a noindex tag, never cached, when params do not pass", async () => {
    const response = await respond({ rawParams: { id: "" } });
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("noindex");
    expect(html).not.toContain("Página boa");
    expect(response.headers.get("cache-control")).toBe("no-cache");
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
  });

  it("does the same when there is nothing to show, even for an indexable route", async () => {
    const response = await respond({
      rawParams: { id: "404" },
      route: { ...route, indexable: true },
    } as never);

    expect(response.headers.get("cache-control")).toBe("no-cache");
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
  });

  it("never breaks the page when the load fails", async () => {
    const warn = spyOn(console, "warn").mockImplementation(() => {});
    const response = await respond({
      route: {
        ...route,
        load: async () => {
          throw new Error("boom");
        },
      },
    } as never);

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-cache");
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("answers 405 to a method that is not GET or HEAD", async () => {
    const response = await respond({
      request: new Request("https://site.test/post/1", { method: "POST" }),
    });

    expect(response.status).toBe(405);
  });

  it("answers 500 when the build has no index.html", async () => {
    const response = await respond({ shell: undefined });

    expect(response.status).toBe(500);
  });
});
