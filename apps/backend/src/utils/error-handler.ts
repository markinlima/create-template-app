import { isAPIError } from "better-auth/api";
import { type ErrorHandler, NotFoundError, ValidationError } from "elysia";

import { type ErrorModelInput, errorModel } from "@shared/routes/models";

import { AppError } from "@/errors/app-error";
import { pt } from "@/lang/pt";
import { Sentry } from "@/lib/sentry";

/**
 * The one place errors become responses: every route answers with the `ErrorModel` shape, whatever raised the error.
 * Server errors (5xx) are logged with their stack and reported to Sentry (when a DSN is set); the client only gets the generic message.
 */
export function errorHandler(): ErrorHandler {
	return ({ error, status }) => {
		function send({ statusCode, ...props }: ErrorModelInput) {
			if (statusCode >= 500) {
				console.error(error);
				Sentry.captureException(error);
			}

			return status(statusCode, errorModel.parse({ statusCode, ...props } satisfies ErrorModelInput));
		}

		if (error instanceof AppError) {
			return send({
				message: error.message,
				retryable: error.retryable,
				statusCode: error.statusCode,
				code: error.options?.code,
			});
		}

		if (error instanceof ValidationError) {
			return send({
				message: "Dados inválidos.",
				statusCode: 400,
				retryable: false,
				errors: error.messageValue?.message,
			});
		}

		if (isAPIError(error)) {
			const code = error.body?.code;

			return send({
				message: code && code in pt ? pt[code as keyof typeof pt] : error.message,
				statusCode: error.statusCode,
				retryable: error.statusCode >= 500,
			});
		}

		if (error instanceof NotFoundError) {
			return send({
				message: "Não encontrado.",
				statusCode: 404,
				retryable: false,
			});
		}

		return send({
			message: "Ocorreu um erro interno. Tente novamente mais tarde.",
			statusCode: 500,
			retryable: true,
		});
	};
}
