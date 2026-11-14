import type { Plugin } from "vite";

import { DEFAULT_OWN_BAIT_URL } from "../constants/default-own-bait-url";
import { BAIT_SOURCE } from "./constants/bait-source";
import type { AdblockBaitOptions } from "./types/adblock-bait-options";
import { toBaitFileName } from "./utils/to-bait-file-name";

/**
 * Serve the bait script that `detectAdblock` loads, so the app never has to create it by hand: a file is written to the client build, and
 * `vite dev` answers the same address.
 *
 * @remarks
 * A missing file also fires the `error` event of the script, which would count as a blocker.
 *
 * @param options - See {@link AdblockBaitOptions}.
 * @returns A Vite plugin.
 * @example
 * // vite.config.ts
 * plugins: [adblockBait()]
 */
export function adblockBait({
  path = DEFAULT_OWN_BAIT_URL,
}: AdblockBaitOptions = {}): Plugin {
  const fileName = toBaitFileName(path);
  const address = `/${fileName}`;

  return {
    name: "web-detect-adblock-bait",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split("?")[0] !== address) {
          next();
          return;
        }

        response.setHeader("Content-Type", "text/javascript; charset=utf-8");
        response.setHeader("Cache-Control", "no-store");
        response.end(BAIT_SOURCE);
      });
    },
    generateBundle() {
      // NOTE: a Nitro-style build also has a server environment, which needs no bait
      if (this.environment && this.environment.name !== "client") {
        return;
      }

      this.emitFile({ type: "asset", fileName, source: BAIT_SOURCE });
    },
  };
}
