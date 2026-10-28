import { isAxiosError } from "axios";

export const RETRYABLE_STATUSES = [502];

export function queryRetryHandler(retryCount: number, error: unknown): boolean {
	if (!isAxiosError(error)) {
		return false;
	}

	const isRetryableStatus = RETRYABLE_STATUSES.includes(error.status ?? 500);

	if (!isRetryableStatus) {
		return false;
	}

	if (retryCount < 3) {
		return true;
	}

	return false;
}
