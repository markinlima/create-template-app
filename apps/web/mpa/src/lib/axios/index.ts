import { createIsomorphicFn } from "@tanstack/react-start";
import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";

import { clientEnv } from "../env/client";

const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "SSR";

const getForwardHeaders = createIsomorphicFn()
	.client(() => new Headers())
	.server(async () => {
		const { getRequestHeaders } = await import("@tanstack/react-start/server");
		const cookie = getRequestHeaders().get("cookie");
		const headers = new Headers();
		if (cookie) {
			headers.set("cookie", cookie);
		}
		return headers;
	});

// ? API_INTERNAL_URL is a dev-only, unvalidated escape hatch (not part of the env schema):
// ? in some setups SSR can't reach the backend at VITE_API_URL (e.g. it points to a host-only
// ? published port, unreachable from inside a container the backend also runs in). When set,
// ? SSR uses it instead; the browser always uses VITE_API_URL.
const getBaseURL = createIsomorphicFn()
	.client(() => clientEnv.VITE_API_URL)
	.server(() => process.env.API_INTERNAL_URL ?? clientEnv.VITE_API_URL);

export const api = axios.create({
	baseURL: clientEnv.VITE_API_URL,
	timeout: 20000,
	withCredentials: true,
	paramsSerializer: {
		// ? This is required to prevent the default array format (e.g., type[]=a&type[]=b) and use the desired format (e.g., type=a&type=b)
		indexes: null,
	},
	headers: {
		"x-app-version": clientEnv.VITE_WEB_VERSION,
		"x-device-platform": "WEB",
		"x-platform-version": userAgent,
		"x-api-version": clientEnv.VITE_API_VERSION,
	},
});

export type RequestConfig<TData = unknown> = AxiosRequestConfig<TData>;

export type ResponseConfig<TData = unknown> = AxiosResponse<TData>;

export type ResponseErrorConfig<TError = unknown> = AxiosError<TError>;

// Required when used with @kubb/plugin-react-query or @kubb/plugin-vue-query
export type Client = <TData, _TError = unknown, TVariables = unknown>(config: RequestConfig<TVariables>) => Promise<ResponseConfig<TData>>;

async function client<TData, _TError = unknown, TVariables = unknown>(config: RequestConfig<TVariables>): Promise<ResponseConfig<TData>> {
	const [baseURL, extraHeaders] = await Promise.all([getBaseURL(), getForwardHeaders()]);

	const headers = {
		...config.headers,
		...Object.fromEntries(extraHeaders.entries()),
	};

	const response = await api.request<TData, AxiosResponse<TData>, TVariables>({
		...config,
		baseURL: config.baseURL ?? baseURL,
		headers,
	});

	return response;
}

export default client;
