import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ServerCrashIcon } from "lucide-react";
import { z } from "zod";

import { ErrorFeedback } from "@/components/status/error-feedback";
import { routes } from "@/core/routes";

export const Route = createFileRoute("/error/server-error/")({
	validateSearch: z.object({ redirect: z.string().optional() }),
	component: RouteComponent,
});

function RouteComponent() {
	const { redirect } = Route.useSearch();
	const navigate = useNavigate();

	return (
		<ErrorFeedback.presets.generic
			icon={ServerCrashIcon}
			title="Servidor indisponível"
			description="Não conseguimos falar com o servidor agora. Tente novamente em instantes."
			reset={() => navigate({ to: redirect || routes.HOME_URL })}
			className="flex h-svh w-full items-center justify-center"
		/>
	);
}
