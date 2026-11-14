import { afterEach, describe, expect, it, mock } from "bun:test";

import { stubGlobal, unstubAllGlobals } from "@shared/utils/test";

import { isRequestBlocked } from "./is-request-blocked";

afterEach(() => {
  unstubAllGlobals();
});

describe("isRequestBlocked", () => {
  it("is not blocked when the server answers, whatever the status", async () => {
    const fetchMock = mock().mockResolvedValue(
      new Response(null, { status: 404 }),
    );
    stubGlobal("fetch", fetchMock);

    expect(
      await isRequestBlocked(
        { url: "https://errors.test/api/1/envelope/" },
        1000,
      ),
    ).toBe(false);
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      method: "GET",
      body: undefined,
      mode: "no-cors",
    });
  });

  it("sends an empty body on a POST", async () => {
    const fetchMock = mock().mockResolvedValue(
      new Response(null, { status: 400 }),
    );
    stubGlobal("fetch", fetchMock);

    await isRequestBlocked(
      { url: "https://errors.test/api/1/envelope/", method: "POST" },
      1000,
    );

    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      method: "POST",
      body: "",
    });
  });

  it("is blocked when the request is rejected", async () => {
    stubGlobal(
      "fetch",
      mock().mockRejectedValue(new TypeError("Failed to fetch")),
    );

    expect(
      await isRequestBlocked(
        { url: "https://errors.test/api/1/envelope/" },
        1000,
      ),
    ).toBe(true);
  });
});
