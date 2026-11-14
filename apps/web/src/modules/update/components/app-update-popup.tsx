import { useHasNewUpdate } from "@/lib/update/update";

/**
 * FIXME: generic placeholder of the update notice. It only has to read `useHasNewUpdate` and offer a reload; replace the markup with the
 * design of the project, and keep the same export. It has no close button on purpose: an old build can break at any click.
 */
export function AppUpdatePopup() {
	const hasNewUpdate = useHasNewUpdate();

	if (!hasNewUpdate) {
		return null;
	}

	return (
		<aside
			role="alert"
			aria-label="Atualização disponível"
			className="bg-card text-card-foreground fixed right-4 bottom-4 z-50 flex max-w-sm flex-col gap-3 rounded-xl border p-4 shadow-lg"
		>
			<p className="font-semibold">Nova versão disponível</p>
			<p className="text-sm">FIXME: texto de exemplo. Atualize a página para usar a versão mais recente.</p>
			<button
				type="button"
				className="bg-primary text-primary-foreground rounded-md px-4 py-2 font-semibold"
				onClick={() => window.location.reload()}
			>
				Atualizar
			</button>
		</aside>
	);
}
