import { describe, expect, it } from "bun:test";

import type { PublicFile, ServedVariant } from "../../types/public-file";
import { pickVariant } from "./pick-variant";

function variant(etag: string): ServedVariant {
  return { body: new Uint8Array(), etag, init: {}, notModifiedInit: {} };
}

const file: PublicFile = {
  raw: variant("raw"),
  gzip: variant("gzip"),
  brotli: variant("br"),
};

describe("pickVariant", () => {
  it("prefers brotli, then gzip", () => {
    expect(pickVariant(file, "gzip, deflate, br").etag).toBe("br");
    expect(pickVariant(file, "gzip, deflate").etag).toBe("gzip");
  });

  it("sends the file as it is when the client takes neither, or says nothing", () => {
    expect(pickVariant(file, "identity").etag).toBe("raw");
    expect(pickVariant(file, "").etag).toBe("raw");
    expect(pickVariant(file, null).etag).toBe("raw");
  });

  it("respects a quality of zero", () => {
    expect(pickVariant(file, "br;q=0, gzip").etag).toBe("gzip");
    expect(pickVariant(file, "gzip;q=0, br;q=0").etag).toBe("raw");
  });

  it("takes a wildcard as every encoding", () => {
    expect(pickVariant(file, "*").etag).toBe("br");
    expect(pickVariant(file, "*;q=0").etag).toBe("raw");
  });

  it("only uses the copies that exist", () => {
    expect(pickVariant({ raw: variant("raw") }, "gzip, br").etag).toBe("raw");
    expect(
      pickVariant({ raw: variant("raw"), gzip: variant("gzip") }, "br, gzip")
        .etag,
    ).toBe("gzip");
  });
});
