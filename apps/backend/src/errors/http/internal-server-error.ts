import { AppError, type AppErrorOptions } from "../app-error";

export class InternalServerError extends AppError {
	constructor(message = "Ocorreu um erro interno. Tente novamente mais tarde.", options?: AppErrorOptions) {
		super(message, 500, true, options);
	}
}
