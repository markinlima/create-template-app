import { AppError, type AppErrorOptions } from "../app-error";

export class NotFoundError extends AppError {
	constructor(message = "Não encontrado.", options?: AppErrorOptions) {
		super(message, 404, false, options);
	}
}
