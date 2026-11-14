import { AppError, type AppErrorOptions } from "../app-error";

export class BadRequestError extends AppError {
	constructor(message = "Requisição inválida.", options?: AppErrorOptions) {
		super(message, 400, false, options);
	}
}
