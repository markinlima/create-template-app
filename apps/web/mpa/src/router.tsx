import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { PageNotFound } from "@/components/status/page-not-found";
import { RouteError } from "@/components/status/route-error";
import { SplashScreen } from "@/components/status/splash-screen";
import { getQueryClient } from "@/lib/tanstack-query";
import { routeTree } from "@/types/routeTree.generated";

export function getRouter() {
	const queryClient = getQueryClient();

	const router = createTanStackRouter({
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

	setupRouterSsrQueryIntegration({ router, queryClient });

	return router;
}
