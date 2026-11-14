export const TRUNKS = ["dev", "staging", "main"] as const;

export type Trunk = (typeof TRUNKS)[number];

export interface PickTargetOptions {
  /** The branch the pull request comes from. */
  branch: string;
  /** The trunks that exist on the remote: `staging` is optional per project. */
  remoteTrunks: string[];
}

export type Target =
  | { base: string; reason: string }
  | { base: null; reason: string };

/**
 * The trunk a pull request goes to, from the flow `feature -> dev -> staging -> main`: any other branch goes to `dev`, `dev` is promoted to
 * `staging` (or to `main` when the project has no `staging`), `staging` to `main`, and `main` has nowhere to go.
 */
export function pickTarget({
  branch,
  remoteTrunks,
}: PickTargetOptions): Target {
  if (branch === "main") {
    return {
      base: null,
      reason:
        "main is the final trunk: there is nothing to open a pull request to",
    };
  }

  if (branch === "staging") {
    return remoteTrunks.includes("main")
      ? { base: "main", reason: "staging is promoted to main" }
      : { base: null, reason: "main does not exist on the remote" };
  }

  if (branch === "dev") {
    if (remoteTrunks.includes("staging")) {
      return { base: "staging", reason: "dev is promoted to staging" };
    }

    return remoteTrunks.includes("main")
      ? {
          base: "main",
          reason: "this project has no staging, so dev is promoted to main",
        }
      : { base: null, reason: "neither staging nor main exist on the remote" };
  }

  if (["master", "develop"].includes(branch)) {
    return {
      base: null,
      reason: `"${branch}" is a trunk this flow does not know: ask the user where it goes`,
    };
  }

  return remoteTrunks.includes("dev")
    ? { base: "dev", reason: "a branch of work goes to dev" }
    : { base: null, reason: "dev does not exist on the remote" };
}

/** Whether a `--base` the user asked for breaks the flow: only a hotfix may skip a trunk. */
export function checkBase({
  branch,
  base,
  remoteTrunks,
}: PickTargetOptions & { base: string }) {
  const errors: string[] = [];
  const expected = pickTarget({ branch, remoteTrunks });

  if (!remoteTrunks.includes(base)) {
    errors.push(`"${base}" does not exist on the remote`);
  }

  if (expected.base !== base && !branch.startsWith("hotfix(")) {
    errors.push(
      `a pull request from "${branch}" goes to "${expected.base ?? "nowhere"}", not "${base}" (only a hotfix branch may skip part of the flow)`,
    );
  }

  return errors;
}

/** Whether a branch is one of the trunks: a trunk is never pushed by the skill. */
export function isTrunk(branch: string) {
  return (TRUNKS as readonly string[]).includes(branch);
}
