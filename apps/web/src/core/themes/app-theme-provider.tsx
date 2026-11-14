import type { ReactNode } from "react";

import { ThemeProvider } from "./app-theme";

/**
 * Connects the theme lib to the app: gives it the user level.
 * FIXME: Placeholder. Both themes are free (level 0); derive the level from the user (a subscription, a role...) if some theme needs one.
 */
export function AppThemeProvider({ children }: { children: ReactNode }) {
	return <ThemeProvider userLevel={0}>{children}</ThemeProvider>;
}
