import { describe, expect, it } from "bun:test";

import { matchesEtag } from "./matches-etag";

describe("matchesEtag", () => {
  it("matches the same ETag", () => {
    expect(matchesEtag('"abc"', '"abc"')).toBe(true);
  });

  it("does not match another one, or a request without the header", () => {
    expect(matchesEtag('"abd"', '"abc"')).toBe(false);
    expect(matchesEtag(null, '"abc"')).toBe(false);
    expect(matchesEtag("", '"abc"')).toBe(false);
  });

  it("finds the ETag in a list, weak or not", () => {
    expect(matchesEtag('"x", "abc", "y"', '"abc"')).toBe(true);
    expect(matchesEtag('W/"abc"', '"abc"')).toBe(true);
  });

  it("matches everything for a star", () => {
    expect(matchesEtag("*", '"abc"')).toBe(true);
  });
});
