import type { NitroPluginConfig } from "nitro/vite";

/**
 * Nitro options every app of this server uses: the Bun preset, no static serving by Nitro (the server of this lib serves the build) and no
 * renderer. The app overrides any of them in `webServer({ nitro })`.
 *
 * @remarks
 * `vite dev` has no build, so the app gives a `renderer` there (`{ template: "./index.html" }`) that answers its addresses with `index.html`.
 */
export const DEFAULT_NITRO_CONFIG = {
  preset: "bun",
  serveStatic: false,
  renderer: false,
} satisfies NitroPluginConfig;
