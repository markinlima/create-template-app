/**
 * Whether the build leaves the TanStack devtools out. They stay only in a debug-mode build that is not a production one, so a `VITE_DEBUG_MODE=true`
 * set in production by mistake still ships without them. A missing `VITE_USER_NODE_ENV` counts as production, like in the env schema.
 */
export function shouldRemoveDevtools(env: Record<string, string | undefined>) {
	const isDebugMode = env.VITE_DEBUG_MODE === "true";
	const isProduction = (env.VITE_USER_NODE_ENV ?? "production") === "production";

	return !isDebugMode || isProduction;
}
