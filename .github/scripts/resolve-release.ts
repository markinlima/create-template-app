import { PROJECTS_FILE } from "./constants/projects-file";
import { CiError } from "./utils/github/ci-error";
import { main } from "./utils/github/main";
import { requireEnv } from "./utils/github/require-env";
import { setOutputs } from "./utils/github/set-outputs";
import { buildReleaseConfig } from "./utils/release/build-release-config";
import { isOnBranch } from "./utils/release/is-on-branch";
import { parseTag } from "./utils/release/parse-tag";
import { resolveAppConfig } from "./utils/release/resolve-app-config";
import { listWorkspaces } from "./utils/workspaces/list-workspaces";

// NOTE: validates a release before anything is tested or built, and resolves what the next jobs need.
// NOTE: the tag, its trunk and the app's release config must all be valid (see utils/release/).
if (import.meta.main) {
  await main(async () => {
    const tag = requireEnv("TAG");
    const release = parseTag(tag);

    if (!(await isOnBranch(release.branch))) {
      throw new CiError(
        `Tag '${tag}' points to a commit that is not on '${release.branch}'. Final releases must come from main and release candidates from staging.`,
      );
    }

    const workspace = (await listWorkspaces()).find(
      (item) => item.name === release.app,
    );
    if (!workspace) {
      throw new CiError(`No workspace is named '${release.app}'.`);
    }
    if (!(await Bun.file(`${workspace.path}/dockerfile`).exists())) {
      throw new CiError(`'${release.app}' has no dockerfile to release.`);
    }

    const { dokployComposeId, phaseAppId } = resolveAppConfig({
      config: buildReleaseConfig({
        projects: (await Bun.file(PROJECTS_FILE).json()).projects,
      }),
      app: release.app,
      environment: release.environment,
    });

    console.log(
      `App: ${release.app} | Version: ${release.version} | RC: ${release.isRc} | Environment: ${release.environment}`,
    );
    setOutputs({
      app: release.app,
      path: workspace.path,
      version: release.version,
      "is-rc": String(release.isRc),
      environment: release.environment,
      ref: `refs/tags/${tag}`,
      "phase-app-id": phaseAppId,
      "dokploy-compose-id": dokployComposeId,
    });
  });
}
