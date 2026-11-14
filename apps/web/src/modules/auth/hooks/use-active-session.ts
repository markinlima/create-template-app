import { useSession } from "./use-session";

/** The session inside the private area, where the route guard already made sure it exists. */
export function useActiveSession() {
	const session = useSession();

	if (!session) {
		throw new Error("useActiveSession must be used inside the /app route");
	}

	return session;
}
