import { TRUNK_BRANCHES } from "../../constants/trunk-branches";

export interface ResolveScmBaseOptions {
  eventName: string;
  branch: string;
  /** `before` of a push event: the branch tip before the push (all zeros for a new branch). */
  before?: string;
  /** Whether `before` is still in the history (a force push may have dropped it). */
  beforeExists: boolean;
  /** `pull_request.base.sha` of a pull request event. */
  pullRequestBaseSha?: string;
  /** Merge base of the pushed commit with the default base branch, when that branch exists. */
  mergeBase?: string;
}

function isZeroSha(sha: string) {
  return /^0+$/.test(sha);
}

/**
 * Picks the commit that every "what changed?" question of a CI run compares against (Turborepo's `--affected`),
 * so no tool guesses on its own.
 *
 * - pull request: the base branch's commit the PR was opened against;
 * - push to a trunk: the tip before the push, so only what this push brought in is checked;
 * - push to any other branch: where it forked from the default base branch, so the whole branch is checked on every push;
 * - anything else (schedule, manual run): no base.
 *
 * @param options - See {@link ResolveScmBaseOptions}.
 * @returns The base commit, or undefined when everything must be checked.
 */
export function resolveScmBase(options: ResolveScmBaseOptions) {
  const { eventName, branch, before, beforeExists, pullRequestBaseSha } =
    options;

  if (eventName === "pull_request") {
    return pullRequestBaseSha;
  }
  if (eventName !== "push") {
    return undefined;
  }

  const validBefore =
    before && !isZeroSha(before) && beforeExists ? before : undefined;

  if (TRUNK_BRANCHES.includes(branch)) {
    return validBefore;
  }
  return options.mergeBase ?? validBefore;
}
