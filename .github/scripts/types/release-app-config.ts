import type { Environment } from "./environment";

/** One app's entry in the release config file. */
export interface ReleaseAppConfig {
  dokploy?: Partial<Record<Environment, string>>;
  phase?: { appId?: string };
}
