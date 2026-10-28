import { useQueryClient } from "@tanstack/react-query";

import type { HookOptions } from "@/gen/api/hooks/HookOptions";
import { customHookOptions } from "@/hooks/custom-hook-options";
import type { HookOptionsFactory } from "@/hooks/custom-hook-options/types";

/**
 * Called by every generated mutation/query hook (see `customOptions` in kubb.config.ts) to get
 * the options defined for it in `custom-hook-options/`, or `{}` when it has none.
 * Only the factory of the requested hook runs.
 */
export function useCustomHookOptions<THookName extends keyof HookOptions>({
	hookName,
}: {
	hookName: THookName;
	operationId: string;
}): HookOptions[THookName] {
	const queryClient = useQueryClient();
	const factory = customHookOptions[hookName] as HookOptionsFactory<THookName> | undefined;

	return factory?.({ queryClient }) ?? ({} as HookOptions[THookName]);
}
