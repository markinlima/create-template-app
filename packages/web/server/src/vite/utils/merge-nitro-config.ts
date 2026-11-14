import type { NitroPluginConfig } from "nitro/vite";

import { DEFAULT_NITRO_CONFIG } from "../constants/default-nitro-config";

/**
 * Put the options of the app over the defaults of the server.
 *
 * @param config - The Nitro options of the app.
 * @returns The defaults with every option of the app on top; an option the app gives wins, nested objects are not merged, and an option
 * set to `undefined` keeps the default.
 */
export function mergeNitroConfig(
  config: NitroPluginConfig = {},
): NitroPluginConfig {
  const given = Object.fromEntries(
    Object.entries(config).filter(([, value]) => value !== undefined),
  );

  return { ...DEFAULT_NITRO_CONFIG, ...given };
}
