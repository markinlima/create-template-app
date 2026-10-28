import { isAxiosError } from "axios";

/**
 * The user-facing message of an API error (`{ statusCode, message, retryable }`), or `undefined`
 * when the error didn't come with one (network failure, unexpected error...).
 */
export function getApiErrorMessage(error: unknown): string | undefined {
	if (!isAxiosError(error)) {
		return undefined;
	}

	const message: unknown = error.response?.data?.message;

	return typeof message === "string" ? message : undefined;
}
