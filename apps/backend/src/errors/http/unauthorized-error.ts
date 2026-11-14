import { AppError, type AppErrorOptions } from "../app-error";

export class UnauthorizedError extends AppError {
	constructor(message = "Sem autorização.", options?: AppErrorOptions) {
		super(message, 401, false, options);
	}
}
