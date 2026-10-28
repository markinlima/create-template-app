import type { AlertItem } from "@web/alert";

/**
 * The alerts of the release, shown once to every user (see `AlertCenter` in `@web/alert`).
 * FIXME: Placeholder text. Replace it with the real notes of the release (and change the id to show new notes again).
 */
const releaseAlerts: AlertItem[] = [
	{
		id: "update-notes-1",
		type: "update",
		importance: "low",
		title: "Novidades",
		body: "Texto de exemplo de uma **nota de versão**. Troque pelo conteúdo real.",
	},
];

export const alerts: AlertItem[] = import.meta.env.DEV ? [...releaseAlerts] : releaseAlerts;
