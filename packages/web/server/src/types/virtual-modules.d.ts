/** Made by the Vite plugin (`@web/server/vite`) while Nitro bundles the server. */
declare module "#web-server/runtime" {
  import type { WebServerConfig } from "./web-server-config";

  /** What the app says in its `server/web-server.config.ts`; empty when it has none. */
  export const config: WebServerConfig;
  /** Where the files of the client are, from the folder of the server (`../client`). */
  export const publicDir: string;
  /** Whether Nitro runs for `vite dev` (no build to serve). */
  export const isDev: boolean;
}
