import { ReducedMotionSetting } from "@/modules/settings/components/reduced-motion-setting";

/**
 * The settings page. Each setting is one row inside the list: add a new one here, next to the others.
 * FIXME: Placeholder page. Group the settings in sections when there are more of them.
 */
export function SettingsPage() {
	return (
		<section className="page-container">
			<h1 className="text-3xl font-bold">Configurações</h1>
			<div className="flex flex-col gap-6">
				<ReducedMotionSetting />
			</div>
		</section>
	);
}
