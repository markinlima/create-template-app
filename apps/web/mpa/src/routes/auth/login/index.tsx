import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { LoginForm } from "@/modules/auth/components/login-form";

export const Route = createFileRoute("/auth/login/")({
	head: () => ({ meta: [{ title: "Entrar" }] }),
	validateSearch: z.object({ redirect: z.string().optional() }),
	component: RouteComponent,
});

// FIXME: Placeholder page, an example of a route with search params and a form.
function RouteComponent() {
	const { redirect } = Route.useSearch();

	return (
		<div className="space-y-6">
			<h1 className="font-bold text-2xl">Entrar</h1>
			<LoginForm redirectUrl={redirect} />
		</div>
	);
}
