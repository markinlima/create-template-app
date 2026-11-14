import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";

import { clientEnv } from "../env/client";

const userAgent = navigator.userAgent;

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
	return api.request<TData, AxiosResponse<TData>, TVariables>(config);
}

export default client;
