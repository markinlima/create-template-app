import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";

import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME, RETRY_DELAY } from "@/core/cache";
import { globalErrorHandler } from "@/lib/tanstack-query/query-error-handler";
import { queryRetryHandler } from "@/lib/tanstack-query/retry";

function createQueryClient() {
	const mutationCache = new MutationCache({
		onError: (error, _, _1) => globalErrorHandler(error),
	});

	const queryCache = new QueryCache({
		onError: (error) => globalErrorHandler(error),
	});

	return new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnReconnect: true,
				refetchOnMount: false,
				refetchOnWindowFocus: false,
				staleTime: DEFAULT_STALE_TIME,
				gcTime: DEFAULT_GC_TIME,
				retryDelay: RETRY_DELAY,
				retry: (retryCount, error) => queryRetryHandler(retryCount, error),
			},
			mutations: {
				retry: (retryCount, error) => queryRetryHandler(retryCount, error),
			},
		},
		mutationCache,
		queryCache,
	});
}

let browserQueryClient: QueryClient | undefined;

// ? A brand new QueryClient must be created for every server request: reusing a single
// ? module-level instance would leak cached data (like another request's session) across
// ? requests/users on the server. The browser keeps one instance for the tab's lifetime.
export const getQueryClient = createIsomorphicFn()
	.server(() => createQueryClient())
	.client(() => {
		browserQueryClient ??= createQueryClient();
		return browserQueryClient;
	});
