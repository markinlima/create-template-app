import { isAxiosError } from "axios";

import { getErrorRedirectUrl } from "@/lib/tanstack-query/get-error-redirect-url";

export function globalErrorHandler(error: Error) {
	if (!isAxiosError(error)) {
		return;
	}

	const redirectUrl = getErrorRedirectUrl({
		status: error.response?.status,
		axiosCode: error.code,
		requestUrl: error.config?.url,
		currentPath: `${location.pathname}${location.search}`,
	});

	if (redirectUrl) {
		location.href = redirectUrl;
	}
}
