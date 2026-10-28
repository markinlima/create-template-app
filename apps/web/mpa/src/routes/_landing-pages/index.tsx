import { createFileRoute, Link } from "@tanstack/react-router";

import { toast } from "@web/notification";
import { Button } from "@web/ui/button";

import { routes } from "@/core/routes";

export const Route = createFileRoute("/_landing-pages/")({
	head: () => ({ meta: [{ title: "Início" }] }),
	component: RouteComponent,
});

// FIXME: Placeholder page. Replace it with the real home page.
function RouteComponent() {
	return (
		<section className="page-container items-center py-16 text-center">
			<h1 className="font-bold text-4xl">Template App</h1>
			<p className="text-muted-foreground">Página inicial de exemplo. Edite ou apague à vontade.</p>
			<div className="flex flex-wrap justify-center gap-2">
				<Link to={routes.DEFAULT_AUTHENTICATED_URL}>
					<Button>Área logada</Button>
				</Link>
				<Button variant="outline" onClick={() => toast.success({ title: "Funcionou!", description: "Exemplo do @web/notification." })}>
					Disparar toast
				</Button>
			</div>
		</section>
	);
}
