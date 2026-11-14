import { useRouteContext } from "@tanstack/react-router";

/** The session set by the guard of the `/app` route, or `null` outside it. */
export function useSession() {
	return useRouteContext({ strict: false, select: (context) => context.session ?? null });
}
