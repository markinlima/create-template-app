import { describe, expect, it, spyOn } from "bun:test";

import { z } from "zod";

import { createApiClient } from "./create-api-client";

const schema = z.object({ name: z.string() });
const options = {
  url: "https://api.test/",
  version: "1",
  headers: { "x-device-platform": "WEB" },
};

function fakeFetch(response: Response | Error) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const fetcher = (async (url: string, init?: RequestInit) => {
    calls.push({ url, init });

    if (response instanceof Error) {
      throw response;
    }

    return response;
  }) as unknown as typeof fetch;

  return { fetcher, calls };
}

describe("createApiClient", () => {
  it("asks the API anonymously and returns the checked answer", async () => {
    const { fetcher, calls } = fakeFetch(Response.json({ name: "Foxy" }));
    const api = createApiClient({ ...options, fetcher });

    expect(await api.get("/posts/1", schema)).toEqual({ name: "Foxy" });
    expect(calls[0]?.url).toBe("https://api.test/posts/1");
    expect(calls[0]?.init?.headers).toMatchObject({
      accept: "application/json",
      "x-api-version": "1",
      "x-device-platform": "WEB",
    });
  });

  it("leaves out the version header when there is no version", async () => {
    const { fetcher, calls } = fakeFetch(Response.json({ name: "Foxy" }));

    await createApiClient({ url: "https://api.test", fetcher }).get(
      "/x",
      schema,
    );

    expect(calls[0]?.init?.headers).not.toHaveProperty("x-api-version");
  });

  it("answers null without a log for content that is missing or private", async () => {
    const warn = spyOn(console, "warn").mockImplementation(() => {});

    for (const status of [401, 403, 404]) {
      const { fetcher } = fakeFetch(new Response(null, { status }));

      expect(
        await createApiClient({ ...options, fetcher }).get("/x", schema),
      ).toBeNull();
    }

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("takes the statuses the app says are normal for missing content", async () => {
    const warn = spyOn(console, "warn").mockImplementation(() => {});
    const { fetcher } = fakeFetch(new Response(null, { status: 410 }));

    expect(
      await createApiClient({
        ...options,
        missingStatuses: [410],
        fetcher,
      }).get("/x", schema),
    ).toBeNull();
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("answers null with a warning when the API fails, times out or answers something unexpected", async () => {
    const warn = spyOn(console, "warn").mockImplementation(() => {});
    const get = (response: Response | Error) =>
      createApiClient({ ...options, fetcher: fakeFetch(response).fetcher }).get(
        "/x",
        schema,
      );

    expect(await get(new Response(null, { status: 500 }))).toBeNull();
    expect(await get(new Error("timeout"))).toBeNull();
    expect(await get(Response.json({ other: 1 }))).toBeNull();
    expect(warn).toHaveBeenCalledTimes(3);
    warn.mockRestore();
  });
});
