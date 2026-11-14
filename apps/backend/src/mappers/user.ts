import type { SessionModel, UserModel } from "@shared/routes/models";

/** The public user: the row's fields the API exposes, nothing else (no password hash, no internal flags). */
export function toUserModel(user: {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	username?: string | null;
	image?: string | null;
	role?: string | null;
}): UserModel {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		emailVerified: user.emailVerified,
		username: user.username ?? null,
		image: user.image ?? null,
		role: user.role ?? "user",
	};
}

export function toSessionModel(session: { id: string; expiresAt: Date }): SessionModel {
	return {
		id: session.id,
		expiresAt: session.expiresAt.toISOString(),
	};
}
