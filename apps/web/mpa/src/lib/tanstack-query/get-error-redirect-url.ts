import { routes } from "@/core/routes";

export interface GetErrorRedirectUrlOptions {
	/** The HTTP status of the answer, when there was one. */
	status?: number;
	/** The code of the error of axios (`ERR_NETWORK`, `ECONNABORTED`...), when the request got no answer. */
	axiosCode?: string;
	/** The address the request went to. */
	requestUrl?: string;
	/** Where the user is: the path and the query string. */
	currentPath: string;
}

const SERVER_DOWN_STATUSES = [502, 503, 504];
const NO_ANSWER_CODES = ["ERR_NETWORK", "ECONNABORTED", "ETIMEDOUT"];

function isAuthRequest(requestUrl?: string) {
	return !!requestUrl?.includes("/auth/");
}

/**
 * The page an error that is not about one screen sends the user to, or `null` when the error is for the screen to show:
 * the server being out of reach (and back to where they were) and the session that ended inside the app (and back after the login).
 */
export function getErrorRedirectUrl({ status, axiosCode, requestUrl, currentPath }: GetErrorRedirectUrlOptions) {
	// ? Already on the page that tells it: going there again would only reload it.
	if (currentPath.startsWith(routes.SERVER_ERROR_URL)) {
		return null;
	}

	if ((status && SERVER_DOWN_STATUSES.includes(status)) || (axiosCode && NO_ANSWER_CODES.includes(axiosCode))) {
		return `${routes.SERVER_ERROR_URL}?redirect=${encodeURIComponent(currentPath)}`;
	}

	// ? A 401 of the login itself (a wrong password) is not a session that ended: only inside the app it is.
	if (status === 401 && currentPath.startsWith(routes.DEFAULT_AUTHENTICATED_URL) && !isAuthRequest(requestUrl)) {
		return `${routes.LOGIN_URL}?redirect=${encodeURIComponent(currentPath)}`;
	}

	return null;
}
