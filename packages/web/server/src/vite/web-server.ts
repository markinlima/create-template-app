import { nitro } from "nitro/vite";
import type { Plugin } from "vite";

import type { WebServerOptions } from "./types/web-server-options";
import { mergeNitroConfig } from "./utils/merge-nitro-config";
import { withServerEnv } from "./utils/with-server-env";
import { webServerModule } from "./web-server-module";

/**
 * Nitro and the web server in one call, so the app configures Nitro in one place and the order of the plugins is always right. It gives
 * `nitro()` with the defaults of the server, then {@link webServerModule}; both stay separate plugins.
 *
 * @param options - See {@link WebServerOptions}.
 * @returns The plugins to put in the Vite config.
 * @example
 * // vite.config.ts
 * plugins: [webServer({ env: { VITE_API_URL: env.VITE_API_URL }, nitro: { serverDir: "./server" } })]
 */
export function webServer({
  nitro: nitroConfig,
  env,
  ...moduleOptions
}: WebServerOptions = {}): Plugin[] {
  return [
    ...nitro(mergeNitroConfig(withServerEnv(nitroConfig, env))),
    webServerModule(moduleOptions),
  ];
}
