import type { ReactNode } from "react";

import { ThemeProvider } from "@web/theme";

import { themeRegistry } from "@/core/themes";
import { themeLevels } from "@/core/themes/levels";

const THEME_STORAGE_KEY = "template-app-theme";

/**
 * Connects the theme lib to the app: the registry with the app's themes and the user level.
 * FIXME: Placeholder. The level should come from the user (a subscription, a role...); here every theme is unlocked.
 */
export function AppThemeProvider({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider registry={themeRegistry} userLevel={themeLevels.premium} storageKey={THEME_STORAGE_KEY}>
			{children}
		</ThemeProvider>
	);
}
