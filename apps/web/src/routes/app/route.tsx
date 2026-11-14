import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AlertCenter } from "@web/alert";
import { NO_INDEX } from "@web/seo";

import { alerts } from "@/core/alerts";
import { routes } from "@/core/routes";
import { AppHeader } from "@/layout/header/app-header";
import { getSession } from "@/modules/auth/utils/get-session";

export const Route = createFileRoute("/app")({
	// ? The whole private area stays out of the search engines; the pages below only name themselves.
	head: () => ({ meta: [{ name: "robots", content: NO_INDEX }] }),
	component: RouteComponent,
	beforeLoad: async ({ location }) => {
		const session = await getSession();

		if (!session) {
			throw redirect({ to: routes.LOGIN_URL, search: { redirect: location.pathname } });
		}

		return { session };
	},
});

function RouteComponent() {
	return (
		<div className="flex size-full flex-col">
			<AppHeader />
			<main className="h-svh-no-header w-full overflow-y-auto">
				<Outlet />
			</main>
			<AlertCenter alerts={alerts} seenStorageKey="alerts-seen" />
		</div>
	);
}
