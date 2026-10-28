import { createFileRoute, Outlet } from "@tanstack/react-router";

import { LandingHeader } from "@/modules/header/components/landing-header";
import { Footer } from "@/modules/landing-pages/components/footer";

export const Route = createFileRoute("/_landing-pages")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex h-svh w-full flex-col overflow-y-auto">
			<LandingHeader />
			<main className="flex flex-col">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
