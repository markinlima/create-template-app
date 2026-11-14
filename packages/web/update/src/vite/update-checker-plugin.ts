import type { Plugin } from "vite";

import { BUILD_ID_ENV_NAME, DEFAULT_FILE_NAME } from "../constants/update-file";
import type { UpdateCheckerPluginOptions } from "../types/update-checker-plugin-options";
import { normalizeFileName } from "../utils/normalize-file-name";
import { createBuildId } from "./utils/create-build-id";
import { createUpdateFileSource } from "./utils/create-update-file-source";

/**
 * Gives the build an id, writes it (with the `content` of the app) into a file of the client build and defines it as `import.meta.env.VITE_BUILD_ID`
 * so the code knows which build it is. The id is made once per Vite run, so the file and the code always carry the same one.
 *
 * @param options - See {@link UpdateCheckerPluginOptions}.
 * @returns The Vite plugin to add to `plugins`.
 */
export function updateChecker({
  fileName: configuredFileName = DEFAULT_FILE_NAME,
  buildId = createBuildId(),
  content,
}: UpdateCheckerPluginOptions = {}): Plugin {
  const fileName = normalizeFileName(configuredFileName);

  return {
    name: "web-update-checker",
    config() {
      return {
        define: {
          [`import.meta.env.${BUILD_ID_ENV_NAME}`]: JSON.stringify(buildId),
        },
      };
    },
    configureServer(server) {
      // NOTE: in dev the file is served here, not a `dist` left by an older build.
      server.middlewares.use(`/${fileName}`, (_request, response) => {
        response.setHeader("Content-Type", "application/json");
        response.setHeader("Cache-Control", "no-store");
        response.end(createUpdateFileSource({ buildId, content }));
      });
    },
    generateBundle() {
      // NOTE: the Nitro server build runs this hook too; only the client writes the file.
      if (this.environment && this.environment.name !== "client") {
        return;
      }

      this.emitFile({
        type: "asset",
        fileName,
        source: createUpdateFileSource({ buildId, content }),
      });
    },
  };
}
