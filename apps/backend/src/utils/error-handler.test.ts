import { describe, expect, it } from "bun:test";

import Elysia from "elysia";

import { BadRequestError } from "@/errors/http/bad-request-error";
import { NotFoundError } from "@/errors/http/not-found-error";

import { errorHandler } from "./error-handler";

const app = new Elysia()
	.onError(errorHandler())
	.get("/app-error", () => {
		throw new BadRequestError("Campo inválido.", { code: "input.invalid" });
	})
	.get("/unexpected", () => {
		throw new Error("secret detail that must not leak");
	})
	.get("/missing", () => {
		throw new NotFoundError("Recurso não encontrado.");
	});

describe("errorHandler", () => {
	it("answers an AppError with its status, message, retryable flag and code", async () => {
		const response = await app.handle(new Request("http://localhost/app-error"));

		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({
			statusCode: 400,
			message: "Campo inválido.",
			retryable: false,
			code: "input.invalid",
		});
	});

	it("answers an unexpected error with a generic 500 that doesn't leak the cause", async () => {
		const response = await app.handle(new Request("http://localhost/unexpected"));
		const body = (await response.json()) as Record<string, unknown>;

		expect(response.status).toBe(500);
		expect(body.message).toBe("Ocorreu um erro interno. Tente novamente mais tarde.");
		expect(JSON.stringify(body)).not.toContain("secret detail");
	});

	it("answers a missing route with a 404 in the same shape", async () => {
		const response = await app.handle(new Request("http://localhost/missing-route"));

		expect(response.status).toBe(404);
		expect(await response.json()).toMatchObject({ statusCode: 404, retryable: false });
	});
});
