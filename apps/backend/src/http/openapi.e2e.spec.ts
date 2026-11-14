import { describe, expect, it } from "bun:test";

import { app } from "@/app";

// biome-ignore lint/suspicious/noExplicitAny: a response body is a loose JSON document; the assertions check its shape
type Body = any;

async function readBody(response: Response): Promise<Body> {
	return (await response.json()) as Body;
}

describe("openapi document", () => {
	it("lists every route with its tags and the x-* fields the frontend reads", async () => {
		const response = await app.handle(new Request("http://localhost/docs/json"));
		const document = await readBody(response);

		expect(response.status).toBe(200);

		const signIn = document.paths["/auth/sign-in"].post;
		expect(signIn.operationId).toBe("sign-in");
		expect(signIn.tags).toEqual(["Auth"]);
		expect(signIn["x-data-shape"]).toBe("dto");
		expect(signIn["x-cache-entity"]).toBe("User");
		expect(signIn["x-pagination-type"]).toBe("none");

		expect(document.paths["/users/me"].get.operationId).toBe("get-me");
		expect(document.paths["/healthz"].get.operationId).toBe("get-health");
	});

	it("publishes the named models as components, without circular references", async () => {
		const document = await readBody(await app.handle(new Request("http://localhost/docs/json")));
		const schemas = document.components.schemas;

		expect(schemas.ErrorModel).toBeDefined();
		expect(schemas.UserModel).toBeDefined();
		expect(schemas.UserModel.$ref).toBeUndefined();
		expect(JSON.stringify(schemas)).not.toContain('"$ref":"#/components/schemas/UserModel"');
	});
});
