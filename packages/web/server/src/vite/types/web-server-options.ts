import type { NitroPluginConfig } from "nitro/vite";

import type { WebServerModuleOptions } from "./web-server-module-options";

/** Options of {@link webServer}. */
export interface WebServerOptions extends WebServerModuleOptions {
  /**
   * The Nitro options of the app (`serverDir`, `runtimeConfig`, `output`, `renderer` in `vite dev`...), put over the defaults of the server.
   * @defaultValue the defaults of the server alone
   */
  nitro?: NitroPluginConfig;
  /**
   * The public envs the server code reads with `getServerEnv()` (e.g. `VITE_API_URL`). They are copied into the server bundle, so give no
   * secret here. They are written to the bundle as JSON, so give only JSON values (strings, numbers, booleans): an `undefined` is dropped.
   * @defaultValue none
   */
  env?: Record<string, unknown>;
}
