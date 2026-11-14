import { describe, expect, it } from "bun:test";

import { buildReleaseNotes } from "./notes";

describe("buildReleaseNotes", () => {
  it("groups the subjects by type and writes the scope before the text", () => {
    const notes = buildReleaseNotes([
      "feat(web): add the dialog",
      "fix(web): keep videos inline",
      "feat(shared): add a helper",
      "docs: explain it",
      "perf(web): minify the spec",
    ]);

    expect(notes).toBe(
      [
        "## Features\n- web: add the dialog\n- shared: add a helper",
        "## Fixes\n- web: keep videos inline",
        "## Performance\n- web: minify the spec",
        "## Docs and chores\n- explain it",
      ].join("\n\n"),
    );
  });

  it("keeps a subject that is not Conventional, under Other, as it is", () => {
    expect(buildReleaseNotes(["Merge it", "fix: one"])).toBe(
      "## Fixes\n- one\n\n## Other\n- Merge it",
    );
  });

  it("is empty without commits", () => {
    expect(buildReleaseNotes([])).toBe("");
  });
});
