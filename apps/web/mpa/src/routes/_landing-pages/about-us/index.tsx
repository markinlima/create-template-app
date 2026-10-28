import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing-pages/about-us/")({
	head: () => ({ meta: [{ title: "Sobre" }] }),
	component: RouteComponent,
});

// FIXME: Placeholder page, an example of a static page inside the landing layout.
function RouteComponent() {
	return (
		<section className="page-container">
			<h1 className="font-bold text-3xl">Sobre</h1>
			<p className="text-muted-foreground">Conteúdo de exemplo.</p>
		</section>
	);
}
