import { createThemeRegistry } from "@web/theme";

import { darkTheme } from "./dark";
import { lightTheme } from "./light";

/** The app's themes. Add one by creating a file like `dark.ts` and listing it here; `level` is the minimum user level that can use it. */
export const themeRegistry = createThemeRegistry({
	themes: [darkTheme, lightTheme],
	defaultThemeName: "dark",
});

export type ThemeName = (typeof themeRegistry.themes)[number]["name"];
