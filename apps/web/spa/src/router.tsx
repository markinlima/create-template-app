import type { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";

import { PageNotFound } from "@/components/status/page-not-found";
import { RouteError } from "@/components/status/route-error";
import { SplashScreen } from "@/components/status/splash-screen";
import { routeTree } from "@/types/routeTree.generated";

export function createRouter({ queryClient }: { queryClient: QueryClient }) {
	return createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: false,
		defaultPreloadStaleTime: 0,
		defaultViewTransition: true,
		defaultErrorComponent: RouteError,
		defaultNotFoundComponent: () => <PageNotFound />,
		defaultPendingComponent: () => <SplashScreen />,
		context: {
			queryClient,
			session: null,
		},
	});
}
