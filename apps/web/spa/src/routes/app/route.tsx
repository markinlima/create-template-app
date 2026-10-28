import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AlertCenter } from "@web/alert";

import { alerts } from "@/core/alerts";
import { routes } from "@/core/routes";
import { getSession } from "@/modules/auth/utils/get-session";
import { AppHeader } from "@/modules/header/components/app-header";

export const Route = createFileRoute("/app")({
	// ? The whole private area stays out of the search engines; the pages below only name themselves.
	head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
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
