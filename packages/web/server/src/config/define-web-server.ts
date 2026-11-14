import type { WebServerConfig } from "../types/web-server-config";

/** Gives the types to the config of the app (`server/web-server.config.ts`, as its default export). */
export function defineWebServer(config: WebServerConfig) {
  return config;
}
