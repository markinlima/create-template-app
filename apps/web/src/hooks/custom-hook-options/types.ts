import type { QueryClient } from "@tanstack/react-query";

import type { HookOptions } from "@/gen/api/hooks/HookOptions";

export interface HookOptionsContext {
	queryClient: QueryClient;
}

/** Builds the custom options (cache updates, side effects...) of one generated hook. */
export type HookOptionsFactory<THookName extends keyof HookOptions> = (context: HookOptionsContext) => HookOptions[THookName];

export type HookOptionsFactories = {
	[THookName in keyof HookOptions]?: HookOptionsFactory<THookName>;
};

/**
 * Declares the custom options of a group of hooks (one file per domain).
 * The key is the generated hook name, so everything is typed from the hook itself.
 */
export function defineHookOptions(factories: HookOptionsFactories) {
	return factories;
}
