import { isAxiosError } from "axios";

import { toast } from "@web/toast";

const NON_TOAST_ERROR_STATUSES = [401, 403, 404, 422];

export function toastErrorHandler(error: Error) {
	if (!isAxiosError(error)) {
		return;
	}

	const errorMessage = error.response?.data.message ?? "Ocorreu um erro inesperado. Tente novamente.";
	const status = error.response?.status ?? 500;

	if (NON_TOAST_ERROR_STATUSES.includes(status)) {
		return;
	}

	const title = `Erro ${status}`;

	toast.error({ title, description: errorMessage });
}
