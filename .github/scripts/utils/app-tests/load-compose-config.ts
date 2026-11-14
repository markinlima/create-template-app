import { join } from "node:path";

import { $ } from "bun";

import { TEST_COMPOSE_FILE } from "../../constants/test-compose-file";
import type { ComposeConfig } from "../../types/compose-config";

/**
 * Loads the resolved compose file of the test stack of an app.
 *
 * @param path - Folder of the app, holding its test compose file.
 */
export async function loadComposeConfig(path: string): Promise<ComposeConfig> {
  // NOTE: `--profile '*'` enables every profile, so services outside the default one are resolved too.
  return $`docker compose -f ${join(path, TEST_COMPOSE_FILE)} --profile ${"*"} config --format json`
    .quiet()
    .json();
}
