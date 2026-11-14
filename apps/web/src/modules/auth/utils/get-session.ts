import type { Session } from "@/modules/auth/types/session";

/**
 * The session of the current user, or `null` when nobody is logged in.
 * FIXME: Placeholder. Replace it with the call to the API (the generated hook/query of the session).
 */
export async function getSession(): Promise<Session | null> {
	return { user: { id: "1", name: "Demo" } };
}
