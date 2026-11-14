import { existsSync } from "node:fs";
import { copyFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { NitroModule } from "nitro/types";
import type { Plugin } from "vite";

import { DEFAULT_CONFIG_PATH } from "../constants/config-path";
import { HEALTH_PATH, HEALTH_SCRIPT_NAME } from "../constants/health";
import { RUNTIME_MODULE_ID } from "../constants/runtime-module-id";
import type { WebServerModuleOptions } from "./types/web-server-module-options";

function fromHere(path: string) {
  return fileURLToPath(new URL(path, import.meta.url));
}

/**
 * The web server of the app, as a Vite plugin that is also a Nitro module (it goes after `nitro()`; {@link webServer} does both): it adds the handlers that answer the
 * files of the build, the app fallback and the security headers of the errors, starts reading the build with the server, and hands them
 * the config of the app. The routes that are the app's own (the pages with data) stay in its `server/routes`.
 *
 * @param options - See {@link WebServerModuleOptions}.
 * @returns A Vite plugin with a `nitro` module.
 */
export function webServerModule({
  config = DEFAULT_CONFIG_PATH,
}: WebServerModuleOptions = {}): Plugin & { nitro: NitroModule } {
  return {
    name: "web-server",
    nitro: {
      name: "web-server",
      setup(nitro) {
        const configPath = resolve(nitro.options.rootDir, config);

        nitro.options.virtual[RUNTIME_MODULE_ID] = () => {
          // NOTE: the client folder relative to the server folder, as the running server finds it
          const publicDir = relative(
            nitro.options.output.serverDir,
            nitro.options.output.publicDir,
          );

          return [
            existsSync(configPath)
              ? `import config from ${JSON.stringify(configPath)};`
              : "const config = {};",
            "export { config };",
            `export const publicDir = ${JSON.stringify(publicDir)};`,
            // NOTE: the routes of the app import this module too, so it exists in development
            `export const isDev = ${JSON.stringify(nitro.options.dev)};`,
          ].join("\n");
        };

        // NOTE: in `vite dev` Vite serves the app and there is no build to read, so the server stays out of the way
        if (nitro.options.dev) {
          return;
        }

        const assetsDir = (nitro.options.buildAssetsDir ?? "assets").replace(
          /^\/|\/$/g,
          "",
        );

        // NOTE: Nitro marks this folder `immutable`, a 404 included; the files carry their own `Cache-Control`
        nitro.options.routeRules[`/${assetsDir}/**`] = {
          ...nitro.options.routeRules[`/${assetsDir}/**`],
          headers: false,
        } as never;

        nitro.options.handlers.push(
          {
            route: "/**",
            middleware: true,
            handler: fromHere("../handlers/security-error-headers.ts"),
          },
          {
            route: "/**",
            middleware: true,
            handler: fromHere("../handlers/static-files.ts"),
          },
          { route: "/**", handler: fromHere("../handlers/spa-fallback.ts") },
          // NOTE: more specific than `/**`, so it wins over the fallback
          { route: HEALTH_PATH, handler: fromHere("../handlers/health.ts") },
        );
        // NOTE: the HEALTHCHECK script goes next to `server/` and `client/`: the image copies only that folder
        nitro.hooks.hook("compiled", () =>
          copyFile(
            fromHere("../scripts/health-check.ts"),
            join(nitro.options.output.dir, HEALTH_SCRIPT_NAME),
          ),
        );
        nitro.options.plugins.push(
          fromHere("../plugins/preload-public-files.ts"),
        );
      },
    },
  };
}
