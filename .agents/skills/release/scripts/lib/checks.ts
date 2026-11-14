export interface CheckRun {
  name: string;
  status: string;
  conclusion: string | null;
}

export interface MergedPull {
  number: number;
  mergedAt: string | null;
  baseRef: string;
  headSha: string;
}

export interface ChecksInput {
  /** The branch the release comes from (`staging` for a candidate, `main` for a final release). */
  branch: string;
  /** The pull requests that contain the latest commit of the branch. */
  pulls: MergedPull[];
  /** The check runs of the head commit of the pull request that merged it. */
  checkRuns: CheckRun[];
  /** The legacy commit statuses of that head commit: the combined state and how many there are. */
  statuses: { state: string; total: number };
}

export interface Verdict {
  green: boolean;
  pull: MergedPull | null;
  problems: string[];
}

const PASSING = ["success", "skipped", "neutral"];

/** The pull request that merged the latest commit of a branch: merged, and into that branch. */
export function findMergingPull(branch: string, pulls: MergedPull[]) {
  return (
    pulls.find((pull) => pull.mergedAt !== null && pull.baseRef === branch) ??
    null
  );
}

/**
 * Whether the checks of the pull request that merged the latest commit of the branch are all green. `main` and `staging` get no run on a
 * push (the pull request tested the merge), so these are the checks that count. Anything failing, pending or missing is a no.
 */
export function evaluateChecks({
  branch,
  pulls,
  checkRuns,
  statuses,
}: ChecksInput): Verdict {
  const pull = findMergingPull(branch, pulls);

  if (!pull) {
    return {
      green: false,
      pull: null,
      problems: [
        `the latest commit of ${branch} has no merged pull request into ${branch} (a direct push)`,
      ],
    };
  }

  const problems: string[] = [];

  if (checkRuns.length === 0 && statuses.total === 0) {
    problems.push(`pull request #${pull.number} has no checks at all`);
  }

  for (const run of checkRuns) {
    if (run.status !== "completed") {
      problems.push(`${run.name}: ${run.status}`);
    } else if (!PASSING.includes(run.conclusion ?? "")) {
      problems.push(`${run.name}: ${run.conclusion ?? "no conclusion"}`);
    }
  }

  if (statuses.total > 0 && statuses.state !== "success") {
    problems.push(`commit statuses: ${statuses.state}`);
  }

  return { green: problems.length === 0, pull, problems };
}
