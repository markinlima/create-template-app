import { describe, expect, it } from "bun:test";

import Elysia from "elysia";

import { errorHandler } from "@/utils/error-handler";

import { csrfPlugin } from "./csrf-plugin";

// Built like the real app: the error handler turns the refusal into its 403 response.
const app = new Elysia()
	.onError(errorHandler())
	.use(csrfPlugin())
	.get("/read", () => "ok")
	.post("/write", () => "ok");

describe("csrfPlugin", () => {
	it("lets safe methods through from any origin", async () => {
		const response = await app.handle(new Request("http://localhost/read", { headers: { origin: "https://evil.example" } }));
		expect(response.status).toBe(200);
	});

	it("lets a state-changing request through when it has no origin (a non-browser client)", async () => {
		const response = await app.handle(new Request("http://localhost/write", { method: "POST" }));
		expect(response.status).toBe(200);
	});

	it("refuses a state-changing request from a cross-site browser context with no origin", async () => {
		const response = await app.handle(
			new Request("http://localhost/write", { method: "POST", headers: { "sec-fetch-site": "cross-site" } }),
		);
		expect(response.status).toBe(403);
	});

	it("refuses a state-changing request from an origin that is not ours", async () => {
		const response = await app.handle(
			new Request("http://localhost/write", { method: "POST", headers: { origin: "https://evil.example" } }),
		);
		expect(response.status).toBe(403);
	});

	it("accepts a state-changing request from one of the trusted origins", async () => {
		const response = await app.handle(
			new Request("http://localhost/write", { method: "POST", headers: { origin: "http://localhost:5173" } }),
		);
		expect(response.status).toBe(200);
	});
});
