import { DEFAULT_BASE_BRANCH } from "./constants/default-base-branch";
import { exportEnv } from "./utils/github/export-env";
import { main } from "./utils/github/main";
import { readEvent } from "./utils/github/read-event";
import { setOutputs } from "./utils/github/set-outputs";
import { gitOutput } from "./utils/scm/git-output";
import { resolveScmBase } from "./utils/scm/resolve-scm-base";

// NOTE: this one rule feeds Turborepo's `--affected` (TURBO_SCM_BASE), so every check of a run agrees.
if (import.meta.main) {
  await main(async () => {
    const event = readEvent();
    const before = typeof event.before === "string" ? event.before : undefined;
    const pullRequest = event.pull_request as
      | { base?: { sha?: string } }
      | undefined;

    const base = resolveScmBase({
      eventName: process.env.GITHUB_EVENT_NAME ?? "",
      branch: process.env.GITHUB_REF_NAME ?? "",
      before,
      beforeExists:
        !!before &&
        (await gitOutput(["cat-file", "-e", `${before}^{commit}`])) !==
          undefined,
      pullRequestBaseSha: pullRequest?.base?.sha,
      mergeBase: await gitOutput([
        "merge-base",
        `origin/${DEFAULT_BASE_BRANCH}`,
        "HEAD",
      ]),
    });

    if (base) {
      console.log(`Comparing against ${base}.`);
      exportEnv({ TURBO_SCM_BASE: base });
    } else {
      // NOTE: steps pass `${TURBO_SCM_BASE:+--affected}`, so without a base every package runs.
      console.log("No base commit: every package is checked.");
    }
    setOutputs({ base: base ?? "" });
  });
}
