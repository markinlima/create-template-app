import { AppError, type AppErrorOptions } from "../app-error";

export class ConflictError extends AppError {
	constructor(message = "Conflito com o estado atual do recurso.", options?: AppErrorOptions) {
		super(message, 409, false, options);
	}
}
