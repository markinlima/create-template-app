import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex h-svh w-full items-center justify-center p-4">
			<div className="w-full max-w-sm">
				<Outlet />
			</div>
		</div>
	);
}
