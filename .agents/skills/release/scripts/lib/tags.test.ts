import { describe, expect, it } from "bun:test";

import {
  applyBump,
  formatTag,
  latestTag,
  nextRc,
  parseTag,
  suggestBump,
  TAG_PATTERN,
  validateTag,
} from "./tags";

const tags = [
  "web-v1.0.0",
  "web-v2.0.0-rc1",
  "web-v2.0.0-rc2",
  "web-v2.0.0-rc10",
  "backend-v9.9.9",
  "web-v2.0.0-rc9",
];

describe("parseTag", () => {
  it("reads project, version and candidate number, also from a project with hyphens", () => {
    expect(parseTag("web-v2.0.0-rc8")).toEqual({
      projectId: "web",
      major: 2,
      minor: 0,
      patch: 0,
      rc: 8,
    });
    expect(parseTag("worker-v1.2.3")).toEqual({
      projectId: "worker",
      major: 1,
      minor: 2,
      patch: 3,
      rc: undefined,
    });
  });

  it("gives nothing for what is not a release tag", () => {
    expect(parseTag("v1.0.0")).toBeNull();
    expect(parseTag("web-2.0.0")).toBeNull();
    expect(parseTag("web-v2.0")).toBeNull();
  });
});

describe("latestTag and nextRc", () => {
  it("compares the candidate numbers as numbers (rc10 is after rc9), and only inside the project", () => {
    expect(latestTag(tags, "web")?.tag).toBe("web-v2.0.0-rc10");
    expect(latestTag(tags, "backend")?.tag).toBe("backend-v9.9.9");
    expect(latestTag(tags, "other")).toBeNull();
  });

  it("puts the final release after its candidates", () => {
    expect(latestTag([...tags, "web-v2.0.0"], "web")?.tag).toBe("web-v2.0.0");
  });

  it("gives the next candidate of a version, rc1 when it has none", () => {
    expect(nextRc(tags, "web", "2.0.0")).toBe(11);
    expect(nextRc(tags, "web", "2.1.0")).toBe(1);
    expect(nextRc(tags, "backend", "9.9.9")).toBe(1);
  });
});

describe("suggestBump and applyBump", () => {
  it("asks for a major on a breaking change, a minor on a feature and a patch otherwise", () => {
    expect(suggestBump(["fix(web): a", "feat(web)!: b"])).toBe("major");
    expect(suggestBump(["fix(web): a", "feat(web): b"])).toBe("minor");
    expect(suggestBump(["fix(web): a", "docs: b"])).toBe("patch");
    expect(suggestBump([])).toBe("patch");
  });

  it("applies the bump to a version", () => {
    const version = { major: 2, minor: 3, patch: 4 };

    expect(applyBump(version, "major")).toBe("3.0.0");
    expect(applyBump(version, "minor")).toBe("2.4.0");
    expect(applyBump(version, "patch")).toBe("2.3.5");
  });
});

describe("validateTag", () => {
  it("accepts a candidate tag for a candidate and a plain tag for a final release", () => {
    expect(
      validateTag({ tag: "web-v2.1.0-rc1", kind: "rc", existingTags: tags }),
    ).toEqual([]);
    expect(
      validateTag({ tag: "web-v2.1.0", kind: "final", existingTags: tags }),
    ).toEqual([]);
  });

  it("refuses -rcN on a final release, a candidate without it, a tag that exists and a name out of the pattern", () => {
    expect(
      validateTag({
        tag: "web-v2.1.0-rc1",
        kind: "final",
        existingTags: [],
      }).join(),
    ).toContain("must not have -rcN");
    expect(
      validateTag({ tag: "web-v2.1.0", kind: "rc", existingTags: [] }).join(),
    ).toContain("needs -rcN");
    expect(
      validateTag({
        tag: "web-v2.0.0-rc1",
        kind: "rc",
        existingTags: tags,
      }).join(),
    ).toContain("already exists");
    expect(
      validateTag({ tag: "Web_v2", kind: "rc", existingTags: [] }).length,
    ).toBeGreaterThan(0);
  });

  it("formats a tag that matches the pipeline pattern", () => {
    expect(TAG_PATTERN.test(formatTag("web", "2.1.0", 3))).toBe(true);
    expect(formatTag("web", "2.1.0")).toBe("web-v2.1.0");
  });
});
