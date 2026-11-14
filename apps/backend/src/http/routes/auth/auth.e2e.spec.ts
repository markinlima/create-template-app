import { describe, expect, it } from "bun:test";

import { app } from "@/app";

// The e-mail code is fixed to 123456 under NODE_ENV=test (see lib/auth.ts), so the flow can run without an inbox.
// biome-ignore lint/suspicious/noExplicitAny: a response body is a loose JSON document; the assertions check its shape
type Body = any;

async function readBody(response: Response): Promise<Body> {
	return (await response.json()) as Body;
}

const CODE = "123456";
const PASSWORD = "Senha-forte-123";
const ORIGIN = "http://localhost:5173";

let counter = 0;
/** A fresh account for each test, so the suite doesn't depend on the order it runs in. */
function newAccount() {
	counter += 1;
	const stamp = `${Date.now().toString(36)}${counter}`;
	return { name: "Ana Teste", username: `ana_${stamp}`.slice(0, 30), email: `ana.${stamp}@example.test` };
}

function post(path: string, body: unknown, headers: Record<string, string> = {}) {
	return app.handle(
		new Request(`http://localhost${path}`, {
			method: "POST",
			headers: { "content-type": "application/json", origin: ORIGIN, ...headers },
			body: JSON.stringify(body),
		}),
	);
}

function get(path: string, headers: Record<string, string> = {}) {
	return app.handle(new Request(`http://localhost${path}`, { headers: { origin: ORIGIN, ...headers } }));
}

/** The `cookie` header to send back, taken from the `set-cookie` of a response. */
function cookieFrom(response: Response) {
	return response.headers
		.getSetCookie()
		.map((cookie) => cookie.split(";")[0])
		.join("; ");
}

async function signUpVerified(account = newAccount()) {
	const created = await post("/auth/sign-up", { ...account, password: PASSWORD });
	expect(created.status).toBe(201);

	expect((await post("/auth/request-email-verification", { email: account.email })).status).toBe(204);
	expect((await post("/auth/verify-email", { email: account.email, otp: CODE })).status).toBe(204);

	return account;
}

describe("auth", () => {
	it("creates an unverified account on sign-up, without a session", async () => {
		const account = newAccount();
		const response = await post("/auth/sign-up", { ...account, password: PASSWORD });
		const body = await readBody(response);

		expect(response.status).toBe(201);
		expect(body.user.email).toBe(account.email);
		expect(body.user.emailVerified).toBe(false);
		expect(body.user).not.toHaveProperty("password");
		expect(response.headers.getSetCookie()).toEqual([]);
	});

	it("answers a sign-up with an e-mail already taken like a new one, without creating a second account", async () => {
		const account = await signUpVerified();
		const duplicate = await post("/auth/sign-up", { ...account, username: `${account.username}x`, password: "Outra-senha-456" });

		// Better Auth answers the same for a taken e-mail, so the API doesn't reveal which e-mails have accounts.
		expect(duplicate.status).toBe(201);

		// The original account keeps its password, and the duplicate was never stored.
		expect((await post("/auth/sign-in", { emailOrUsername: account.email, password: PASSWORD })).status).toBe(200);
		expect((await post("/auth/sign-in", { emailOrUsername: `${account.username}x`, password: "Outra-senha-456" })).status).toBe(401);
	});

	it("rejects a wrong password with the same answer as an unknown account", async () => {
		const account = await signUpVerified();

		const wrongPassword = await post("/auth/sign-in", { emailOrUsername: account.email, password: "Senha-errada-123" });
		const unknownAccount = await post("/auth/sign-in", { emailOrUsername: "ninguem@example.test", password: "Senha-errada-123" });

		expect(wrongPassword.status).toBe(401);
		expect(unknownAccount.status).toBe(401);
		expect((await readBody(wrongPassword)).message).toBe((await readBody(unknownAccount)).message);
	});

	it("blocks a protected route until the e-mail is verified", async () => {
		const account = newAccount();
		await post("/auth/sign-up", { ...account, password: PASSWORD });

		const signIn = await post("/auth/sign-in", { emailOrUsername: account.email, password: PASSWORD });
		expect(signIn.status).toBe(200);

		const me = await get("/users/me", { cookie: cookieFrom(signIn) });
		const body = await readBody(me);

		expect(me.status).toBe(401);
		expect(body.code).toBe("auth.email_not_verified");
	});

	it("rejects a wrong code and accepts the right one", async () => {
		const account = newAccount();
		await post("/auth/sign-up", { ...account, password: PASSWORD });
		await post("/auth/request-email-verification", { email: account.email });

		const wrong = await post("/auth/verify-email", { email: account.email, otp: "000000" });
		expect(wrong.status).toBeGreaterThanOrEqual(400);

		const right = await post("/auth/verify-email", { email: account.email, otp: CODE });
		expect(right.status).toBe(204);
	});

	it("signs in by username and reads the user with the session cookie", async () => {
		const account = await signUpVerified();

		const signIn = await post("/auth/sign-in", { emailOrUsername: account.username, password: PASSWORD });
		const signInBody = await readBody(signIn);
		expect(signIn.status).toBe(200);
		expect(signInBody.user.username).toBe(account.username);
		expect(signInBody.session.expiresAt).toBeString();

		const me = await get("/users/me", { cookie: cookieFrom(signIn) });
		expect(me.status).toBe(200);
		expect((await readBody(me)).user.email).toBe(account.email);
	});

	it("answers `session: null` to an anonymous request, and ends the session on sign-out", async () => {
		const account = await signUpVerified();
		const signIn = await post("/auth/sign-in", { emailOrUsername: account.email, password: PASSWORD });
		const cookie = cookieFrom(signIn);

		const anonymous = await get("/auth/session");
		expect(anonymous.status).toBe(200);
		expect(await readBody(anonymous)).toEqual({ session: null });

		const signedIn = await get("/auth/session", { cookie });
		expect((await readBody(signedIn)).session.user.email).toBe(account.email);

		const signOut = await post("/auth/sign-out", {}, { cookie });
		expect(signOut.status).toBe(204);

		const afterSignOut = await get("/users/me", { cookie });
		expect(afterSignOut.status).toBe(401);
	});

	it("refuses a state-changing request from another origin", async () => {
		const response = await app.handle(
			new Request("http://localhost/auth/request-email-verification", {
				method: "POST",
				headers: { "content-type": "application/json", origin: "https://evil.example" },
				body: JSON.stringify({ email: "x@example.test" }),
			}),
		);

		expect(response.status).toBe(403);
	});
});
