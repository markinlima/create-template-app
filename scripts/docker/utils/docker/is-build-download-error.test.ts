import { describe, expect, it } from "bun:test";

import { isBuildDownloadError } from "./is-build-download-error";

describe("isBuildDownloadError", () => {
  it("recognizes a failed step that downloads packages", () => {
    for (const step of [
      "bun i --frozen-lockfile",
      "bun install",
      "apk add curl",
      "apt-get update",
    ]) {
      expect(
        isBuildDownloadError(`process "/bin/sh -c ${step}" did not complete`),
      ).toBe(true);
    }
  });

  it("ignores any other failure", () => {
    expect(
      isBuildDownloadError(
        'process "/bin/sh -c bun run build" did not complete',
      ),
    ).toBe(false);
    expect(isBuildDownloadError("")).toBe(false);
  });
});
