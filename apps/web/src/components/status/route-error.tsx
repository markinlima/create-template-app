import type { ErrorComponentProps } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { AlertTriangleIcon, LockKeyholeIcon, SearchXIcon } from "lucide-react";

import { ErrorFeedback } from "@/components/status/error-feedback";

/** What a route shows when it fails to load, depending on what the API answered. It is the default of the router. */
export function RouteError({ error }: ErrorComponentProps) {
	if (isAxiosError(error)) {
		if (error.response?.status === 404) {
			return (
				<ErrorFeedback.presets.generic
					icon={SearchXIcon}
					title="Conteúdo não encontrado"
					description="O conteúdo que você está procurando não existe ou foi removido."
					error={error}
					className="flex h-full w-full items-center justify-center"
				/>
			);
		}
		if (error.response?.status === 403) {
			return (
				<ErrorFeedback.presets.generic
					icon={LockKeyholeIcon}
					title="Acesso negado"
					description="Você não tem permissão para acessar esse conteúdo."
					error={error}
					className="flex h-full w-full items-center justify-center"
				/>
			);
		}
		if (error.response?.status === 400) {
			return (
				<ErrorFeedback.presets.generic
					icon={AlertTriangleIcon}
					title="Erro na solicitação"
					description="O servidor não pôde processar a solicitação devido a um erro no formato da requisição."
					error={error}
					className="flex h-full w-full items-center justify-center"
				/>
			);
		}
	}

	return (
		<ErrorFeedback.presets.generic
			showHomeButton={false}
			className="flex h-full w-full items-center justify-center"
			error={error instanceof Error ? error : undefined}
		/>
	);
}
