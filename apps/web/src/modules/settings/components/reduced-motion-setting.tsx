import { useId } from "react";

import { Switch } from "@web/ui/switch";

import { useSettingsStore } from "@/modules/settings/stores/settings-store";

/** The "less motion" switch of the settings page. */
export function ReducedMotionSetting() {
	const id = useId();
	const reducedMotion = useSettingsStore((state) => state.settings.reducedMotion);
	const setSettings = useSettingsStore((state) => state.setSettings);

	return (
		<div className="flex items-center justify-between gap-4">
			<div className="flex flex-col gap-1">
				<label htmlFor={id} className="font-medium">
					Reduzir movimento
				</label>
				<p className="text-muted-foreground text-sm">Desliga as animações da página. O ícone de carregamento continua girando.</p>
			</div>
			<Switch id={id} checked={reducedMotion} onCheckedChange={(checked) => setSettings({ reducedMotion: checked })} />
		</div>
	);
}
