export type AppErrorOptions = {
	/** Extra data sent to Sentry-like reporters when the error is caught; never shown to the client. */
	metadata?: Record<string, unknown>;
	/** A machine-readable reason the client can branch on, e.g. `auth.email_not_verified`. */
	code?: string;
};

/**
 * An error the app raises on purpose. Throwing it stops the current flow and the global error handler (`utils/error-handler.ts`)
 * turns it into the HTTP response with its status, message and `retryable` flag.
 */
export class AppError extends Error {
	constructor(
		message: string,
		public statusCode: number,
		public retryable: boolean,
		public options?: AppErrorOptions,
	) {
		super(message);
	}
}
