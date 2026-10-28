import { useRouteContext } from "@tanstack/react-router";

/** The session set by the guard of the `/app` route, or `null` outside it. */
export function useSession() {
	return useRouteContext({ strict: false, select: (context) => context.session ?? null });
}

/** The session inside the private area, where the route guard already made sure it exists. */
export function useActiveSession() {
	const session = useSession();

	if (!session) {
		throw new Error("useActiveSession must be used inside the /app route");
	}

	return session;
}
