import type { ResolvedWebServerConfig } from "../types/web-server-config";
import { resolveWebServerConfig } from "../utils/config/resolve-web-server-config";
import { config } from "./runtime";

let resolved: ResolvedWebServerConfig | undefined;

/** The config of the app, resolved once, when it is first needed (the server has started by then, so its environment is there). */
export function getResolvedConfig() {
  resolved ??= resolveWebServerConfig(config);

  return resolved;
}
