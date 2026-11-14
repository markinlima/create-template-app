import { describe, expect, it } from "bun:test";

import { updateFileSchema } from "../schemas/update-file-schema";
import { fetchUpdateFile } from "./fetch-update-file";

function answer(body: BodyInit, init?: ResponseInit) {
  return (async () => new Response(body, init)) as unknown as typeof fetch;
}

describe("fetchUpdateFile", () => {
  it("gives the data of the file", async () => {
    const data = await fetchUpdateFile({
      url: "/version.json",
      schema: updateFileSchema,
      fetcher: answer(JSON.stringify({ buildId: "42" })),
    });

    expect(data).toEqual({ buildId: "42" });
  });

  it("asks without any cache", async () => {
    let init: RequestInit | undefined;

    await fetchUpdateFile({
      url: "/version.json",
      schema: updateFileSchema,
      fetcher: (async (_url: unknown, options?: RequestInit) => {
        init = options;
        return new Response("{}");
      }) as unknown as typeof fetch,
    });

    expect(init?.cache).toBe("no-store");
  });

  it("gives null for a failed answer, a body that is not JSON, one that is not the file and a network error", async () => {
    const options = { url: "/version.json", schema: updateFileSchema };

    expect(
      await fetchUpdateFile({
        ...options,
        fetcher: answer("", { status: 404 }),
      }),
    ).toBeNull();
    expect(
      await fetchUpdateFile({ ...options, fetcher: answer("<html></html>") }),
    ).toBeNull();
    expect(
      await fetchUpdateFile({ ...options, fetcher: answer("{}") }),
    ).toBeNull();
    expect(
      await fetchUpdateFile({
        ...options,
        fetcher: (async () => {
          throw new TypeError("offline");
        }) as unknown as typeof fetch,
      }),
    ).toBeNull();
  });
});
