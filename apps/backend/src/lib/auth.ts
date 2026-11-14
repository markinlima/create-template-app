import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, username } from "better-auth/plugins";

import { db } from "@backend/db";
import * as schema from "@backend/db/schema";

import { env } from "@/env";

import { sendEmail } from "./email";

/** The sessions last 30 days; a revoked session (sign-out, password reset) is removed from the table right away. */
export const SESSION_DURATION_IN_SECONDS = 60 * 60 * 24 * 30;

/**
 * Better Auth: the e-mail and password sign-in, the usernames and the e-mail verification by code (OTP). The tables are in `@backend/db`.
 * Sessions live in the database and the browser holds an httpOnly cookie with the token; routes read them through `authPlugin`.
 */
export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		usePlural: true,
		schema,
	}),
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,
	trustedOrigins: env.CORS_ORIGIN,
	emailAndPassword: {
		enabled: true,
		// No session on sign-up: the e-mail is verified first, then the user signs in.
		autoSignIn: false,
		// Whoever had the old password may hold a session: a reset ends them all.
		revokeSessionsOnPasswordReset: true,
		password: {
			// bcrypt through Bun's native hasher, the same algorithm the existing accounts use.
			hash: (password) => Bun.password.hash(password, { algorithm: "bcrypt" }),
			verify: ({ hash, password }) => Bun.password.verify(password, hash, "bcrypt"),
		},
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				defaultValue: "user",
				// A client can never choose its own role.
				input: false,
			},
		},
	},
	plugins: [
		username(),
		emailOTP({
			// In tests the code is fixed, so the suite can use it without reading the database or an inbox.
			generateOTP: () => (env.NODE_ENV === "test" ? "123456" : randomSixDigitCode()),
			sendVerificationOTP: async ({ email, otp }) => {
				await sendEmail({
					to: email,
					subject: "Seu código de verificação",
					text: `Seu código de verificação é ${otp}. Ele expira em alguns minutos.`,
				});
			},
		}),
	],
	advanced: {
		// Ids are UUIDv7: they sort by creation time, which keeps the indexes compact.
		database: { generateId: () => Bun.randomUUIDv7() },
		defaultCookieAttributes: {
			sameSite: env.IS_DEPLOYED ? "none" : "lax",
			secure: env.IS_DEPLOYED,
			httpOnly: true,
		},
	},
	session: {
		expiresIn: SESSION_DURATION_IN_SECONDS,
	},
});

function randomSixDigitCode() {
	return String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0");
}

// A valid hash of a password nobody knows: checking a password against it takes as long as a real check, so a sign-in for an unknown
// e-mail or username doesn't answer faster than one for a real account.
const DUMMY_PASSWORD_HASH = Bun.password.hash("dummy-password-for-timing", { algorithm: "bcrypt" });

export async function spendPasswordCheckTime(password: string) {
	await Bun.password.verify(password, await DUMMY_PASSWORD_HASH, "bcrypt");
}
