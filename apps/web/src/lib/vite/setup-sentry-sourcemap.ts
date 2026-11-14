import { sentryVitePlugin } from "@sentry/vite-plugin";
import type { PluginOption } from "vite";

import { buildEnvSchema } from "@shared/env/web";

import { warnFeatureDisabled } from "../warn-feature-disabled.ts";

export interface SetupSentrySourcemapOptions {
	mode: string;
	/** The envs of the build, from Vite's `loadEnv`: `Bun.env` does not see the `.env` file the build reads. */
	env: Record<string, string | undefined>;
}

/**
 * The Sentry source maps setup for the Vite config. Without the token, the organization and the project the plugin is not added, and the
 * maps are not generated either: nothing would delete them, so they would be published with the build.
 */
export function setupSentrySourcemap({ mode, env }: SetupSentrySourcemapOptions) {
	const { SENTRY_AUTH_TOKEN, VITE_SENTRY_URL, VITE_SENTRY_ORG, VITE_SENTRY_PROJECT } = buildEnvSchema.parse(env);

	const enabled = !!SENTRY_AUTH_TOKEN && !!VITE_SENTRY_ORG && !!VITE_SENTRY_PROJECT;

	if (!enabled) {
		if (mode !== "test") {
			warnFeatureDisabled({ feature: "Sentry source map upload", envs: ["SENTRY_AUTH_TOKEN", "VITE_SENTRY_ORG", "VITE_SENTRY_PROJECT"] });
		}
		return { enabled, plugins: [] as PluginOption[] };
	}

	const plugins: PluginOption[] = [
		sentryVitePlugin({
			url: VITE_SENTRY_URL,
			authToken: SENTRY_AUTH_TOKEN,
			org: VITE_SENTRY_ORG,
			project: VITE_SENTRY_PROJECT,
			telemetry: false,
			sourcemaps: {
				// As you're enabling client source maps, you probably want to delete them after they're uploaded to Sentry.
				// Set the appropriate glob pattern for your output folder - some glob examples below:
				filesToDeleteAfterUpload: ["./**/*.map", ".*/**/public/**/*.map", "./dist/**/client/**/*.map"],
			},
		}),
	];

	return { enabled, plugins };
}
