import { $ } from "bun";

import { group } from "../github/group";
import { loadComposeConfig } from "./load-compose-config";
import { planImageBuilds } from "./plan-image-builds";

/**
 * Builds the images of the test stack of an app once, so every suite runs on them.
 *
 * @param path - Folder of the app, holding its test compose file.
 */
export async function buildTestImages(path: string) {
  const builds = planImageBuilds(await loadComposeConfig(path));
  for (const build of builds) {
    await group(`Build ${build.service} (${build.image})`, async () => {
      // NOTE: BuildKit is what `docker build` uses by default today. It is asked for in case the daemon is older (build secrets need it).
      await $`docker ${build.args}`.env({
        ...process.env,
        DOCKER_BUILDKIT: "1",
      });
    });
  }
}
