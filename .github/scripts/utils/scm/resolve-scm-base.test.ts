import { describe, expect, it } from "bun:test";

import { resolveScmBase } from "./resolve-scm-base";

const BEFORE = "a".repeat(40);
const MERGE_BASE = "b".repeat(40);
const PR_BASE = "c".repeat(40);
const ZERO = "0".repeat(40);

describe("resolveScmBase", () => {
  it("should use the base commit of a pull request", () => {
    expect(
      resolveScmBase({
        eventName: "pull_request",
        branch: "feat/x",
        beforeExists: false,
        pullRequestBaseSha: PR_BASE,
        mergeBase: MERGE_BASE,
      }),
    ).toBe(PR_BASE);
  });

  it("should compare a push to a trunk with the tip before the push", () => {
    for (const branch of ["dev", "staging", "main"]) {
      expect(
        resolveScmBase({
          eventName: "push",
          branch,
          before: BEFORE,
          beforeExists: true,
          mergeBase: MERGE_BASE,
        }),
      ).toBe(BEFORE);
    }
  });

  it("should compare a push to another branch with where it forked from dev", () => {
    expect(
      resolveScmBase({
        eventName: "push",
        branch: "feat/x",
        before: BEFORE,
        beforeExists: true,
        mergeBase: MERGE_BASE,
      }),
    ).toBe(MERGE_BASE);
  });

  it("should fall back to the tip before the push when dev is not fetched", () => {
    expect(
      resolveScmBase({
        eventName: "push",
        branch: "feat/x",
        before: BEFORE,
        beforeExists: true,
      }),
    ).toBe(BEFORE);
  });

  it("should check everything when a trunk push has no usable before", () => {
    expect(
      resolveScmBase({
        eventName: "push",
        branch: "dev",
        before: ZERO,
        beforeExists: false,
      }),
    ).toBeUndefined();
    expect(
      resolveScmBase({
        eventName: "push",
        branch: "dev",
        before: BEFORE,
        beforeExists: false,
      }),
    ).toBeUndefined();
  });

  it("should check everything on other events", () => {
    expect(
      resolveScmBase({
        eventName: "schedule",
        branch: "main",
        beforeExists: false,
        mergeBase: MERGE_BASE,
      }),
    ).toBeUndefined();
  });
});
