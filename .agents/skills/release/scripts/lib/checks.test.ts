import { describe, expect, it } from "bun:test";

import { type ChecksInput, evaluateChecks } from "./checks";

const merged = {
  number: 48,
  mergedAt: "2026-11-06T16:00:00Z",
  baseRef: "staging",
  headSha: "abc",
};
const green: ChecksInput = {
  branch: "staging",
  pulls: [merged],
  checkRuns: [
    { name: "quality", status: "completed", conclusion: "success" },
    { name: "docs", status: "completed", conclusion: "skipped" },
  ],
  statuses: { state: "pending", total: 0 },
};

describe("evaluateChecks", () => {
  it("is green when every check passed or was skipped", () => {
    expect(evaluateChecks(green)).toEqual({
      green: true,
      pull: merged,
      problems: [],
    });
  });

  it("is not green when a check failed, and says which", () => {
    const verdict = evaluateChecks({
      ...green,
      checkRuns: [
        ...green.checkRuns,
        {
          name: "app-tests / test (backend)",
          status: "completed",
          conclusion: "failure",
        },
      ],
    });

    expect(verdict.green).toBe(false);
    expect(verdict.problems).toEqual(["app-tests / test (backend): failure"]);
  });

  it("is not green while a check is still running, or when there are no checks", () => {
    expect(
      evaluateChecks({
        ...green,
        checkRuns: [
          { name: "quality", status: "in_progress", conclusion: null },
        ],
      }).problems,
    ).toEqual(["quality: in_progress"]);
    expect(evaluateChecks({ ...green, checkRuns: [] }).problems[0]).toContain(
      "no checks at all",
    );
  });

  it("looks at the legacy statuses only when there are some", () => {
    expect(
      evaluateChecks({ ...green, statuses: { state: "pending", total: 0 } })
        .green,
    ).toBe(true);
    expect(
      evaluateChecks({ ...green, statuses: { state: "failure", total: 2 } })
        .problems,
    ).toEqual(["commit statuses: failure"]);
  });

  it("is not green when the commit has no merged pull request into the branch (a direct push, or merged elsewhere)", () => {
    expect(evaluateChecks({ ...green, pulls: [] }).green).toBe(false);
    expect(
      evaluateChecks({ ...green, pulls: [{ ...merged, mergedAt: null }] })
        .green,
    ).toBe(false);
    expect(
      evaluateChecks({ ...green, pulls: [{ ...merged, baseRef: "dev" }] })
        .green,
    ).toBe(false);
  });
});
