import { useEffect } from "react";

import { useSettingsStore } from "@/modules/settings/stores/settings-store";
import { applyReducedMotion } from "@/modules/settings/utils/apply-reduced-motion";

/**
 * Applies the settings of the visitor to the page. It draws nothing and sits once, high in the tree (the root route), so the choice
 * holds on every page, including the login.
 */
export function SettingsManager() {
	const reducedMotion = useSettingsStore((state) => state.settings.reducedMotion);

	useEffect(() => {
		applyReducedMotion(document.documentElement, reducedMotion);
	}, [reducedMotion]);

	return null;
}
