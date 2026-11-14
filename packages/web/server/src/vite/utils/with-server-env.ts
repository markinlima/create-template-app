import type { NitroPluginConfig } from "nitro/vite";

/**
 * Put the envs of the app in the `runtimeConfig` of Nitro, where `getServerEnv()` reads them.
 *
 * @param config - The Nitro options of the app.
 * @param env - The public envs to copy into the server bundle; nothing is added when it is missing.
 * @returns The options with `runtimeConfig.env` set, keeping the rest of `runtimeConfig`.
 */
export function withServerEnv(
  config: NitroPluginConfig = {},
  env?: Record<string, unknown>,
): NitroPluginConfig {
  if (!env) {
    return config;
  }

  return { ...config, runtimeConfig: { ...config.runtimeConfig, env } };
}
