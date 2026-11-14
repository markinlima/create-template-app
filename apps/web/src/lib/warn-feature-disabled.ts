export interface WarnFeatureDisabledOptions {
	/** The feature that stays off, e.g. "Sentry". */
	feature: string;
	/** The envs that have to be set to turn it on. */
	envs: string[];
}

/**
 * Tells the terminal (in yellow) that an optional feature is off because its envs are not set. It only prints in Node (the terminal of `vite` and of the build): in
 * the browser the same message would just be noise for the user.
 */
export function warnFeatureDisabled({ feature, envs }: WarnFeatureDisabledOptions) {
	if (typeof window !== "undefined") {
		return;
	}

	console.warn(`⚠️ [env] ${feature} is disabled: set ${envs.join(", ")} to enable it.`);
}
