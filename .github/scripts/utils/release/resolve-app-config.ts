import { PLACEHOLDER_PREFIX } from "../../constants/placeholder-prefix";
import { PROJECTS_FILE } from "../../constants/projects-file";
import type { Environment } from "../../types/environment";
import type { ReleaseAppConfig } from "../../types/release-app-config";
import { CiError } from "../github/ci-error";

function isPlaceholder(value: string) {
  return value.startsWith(PLACEHOLDER_PREFIX);
}

export interface ResolveAppConfigOptions {
  config: Record<string, ReleaseAppConfig>;
  app: string;
  environment: Environment;
}

/**
 * Resolves the Dokploy compose id of an app for an environment and its Phase app id.
 * Collects every problem before it fails, so one run reports them all.
 *
 * @param options - See {@link ResolveAppConfigOptions}.
 * @returns The ids; `phaseAppId` is empty when the app needs no Phase envs.
 * @throws {CiError} When the app is unknown, or its ids are missing or still placeholders.
 */
export function resolveAppConfig(options: ResolveAppConfigOptions) {
  const { config, app, environment } = options;
  const entry = config[app];
  if (!entry) {
    throw new CiError(
      `No release config for '${app}'. Add it to ${PROJECTS_FILE}.`,
    );
  }

  const dokployComposeId = entry.dokploy?.[environment] ?? "";
  const phaseAppId = entry.phase?.appId ?? "";

  const errors: string[] = [];
  if (!dokployComposeId || isPlaceholder(dokployComposeId)) {
    errors.push(
      `The Dokploy compose id of '${app}' for ${environment} is missing or still a placeholder ('${dokployComposeId}').`,
    );
  }
  if (isPlaceholder(phaseAppId)) {
    errors.push(
      `The Phase app id of '${app}' is still the placeholder '${phaseAppId}'.`,
    );
  }
  if (errors.length > 0) {
    throw new CiError(errors.join(" "));
  }

  return { dokployComposeId, phaseAppId };
}
