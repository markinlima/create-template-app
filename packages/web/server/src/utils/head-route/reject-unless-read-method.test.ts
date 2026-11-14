import { describe, expect, it } from "bun:test";

import { rejectUnlessReadMethod } from "./reject-unless-read-method";

describe("rejectUnlessReadMethod", () => {
  it("lets GET and HEAD through", () => {
    expect(
      rejectUnlessReadMethod(new Request("http://x.test/", { method: "GET" })),
    ).toBeUndefined();
    expect(
      rejectUnlessReadMethod(new Request("http://x.test/", { method: "HEAD" })),
    ).toBeUndefined();
  });

  it("answers 405 with the allowed methods for the others", () => {
    const response = rejectUnlessReadMethod(
      new Request("http://x.test/", { method: "POST" }),
    );

    expect(response?.status).toBe(405);
    expect(response?.headers.get("allow")).toBe("GET, HEAD");
  });
});
