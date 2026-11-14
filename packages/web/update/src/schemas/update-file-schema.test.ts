import { describe, expect, it } from "bun:test";

import { updateFileSchema } from "./update-file-schema";

describe("updateFileSchema", () => {
  it("keeps the fields the app added", () => {
    expect(updateFileSchema.parse({ buildId: "1", notes: "x" })).toEqual({
      buildId: "1",
      notes: "x",
    });
  });

  it("refuses what is not an object with a build id", () => {
    for (const body of [
      null,
      undefined,
      "text",
      3,
      [],
      {},
      { buildId: 1 },
      { buildId: "" },
    ]) {
      expect(updateFileSchema.safeParse(body).success).toBe(false);
    }
  });
});
