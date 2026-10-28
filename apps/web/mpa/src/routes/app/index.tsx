import { createFileRoute } from "@tanstack/react-router";

import { useActiveSession } from "@/modules/auth/hooks/session";

export const Route = createFileRoute("/app/")({
	head: () => ({ meta: [{ title: "Início" }] }),
	component: RouteComponent,
});

// FIXME: Placeholder page of the private area.
function RouteComponent() {
	const { user } = useActiveSession();

	return (
		<section className="page-container">
			<h1 className="font-bold text-3xl">Área logada</h1>
			<p className="text-muted-foreground">Você está logado como {user.name}.</p>
		</section>
	);
}
