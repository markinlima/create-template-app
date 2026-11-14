import { describe, expect, it } from "bun:test";

import { safer } from "./safer";

describe("safer", () => {
  it("gives the data when the callback works", () => {
    expect(safer(() => 42)).toEqual({ success: true, data: 42 });
  });

  it("gives the error, and no data, when the callback throws", () => {
    const error = new Error("boom");
    const result = safer(() => {
      throw error;
    });

    expect(result).toEqual({ success: false, data: null, error });
  });

  it("gives null data when the callback returns nothing", () => {
    expect(safer(() => undefined)).toEqual({ success: true, data: null });
  });
});
