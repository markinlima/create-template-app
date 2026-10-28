import type { QueryClient } from "@tanstack/react-query";

import type { Session } from "@/modules/auth/types/session";
import type { getRouter } from "@/router";

export interface RouteContext {
	queryClient: QueryClient;
	session: Session | null;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
