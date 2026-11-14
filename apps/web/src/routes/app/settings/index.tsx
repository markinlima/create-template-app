import { createFileRoute } from "@tanstack/react-router";

import { SettingsPage } from "@/modules/settings/components/settings-page";

export const Route = createFileRoute("/app/settings/")({
	head: () => ({ meta: [{ title: "Configurações" }] }),
	component: SettingsPage,
});
