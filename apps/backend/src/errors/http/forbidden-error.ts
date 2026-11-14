import { AppError, type AppErrorOptions } from "../app-error";

export class ForbiddenError extends AppError {
	constructor(message = "Você não tem permissão para realizar esta ação.", options?: AppErrorOptions) {
		super(message, 403, false, options);
	}
}
