import { createTheme } from "@web/theme";

import { themeRegistry } from "./index";

const THEME_STORAGE_KEY = "template-app-theme";

/** The app's theme: `ThemeProvider` once near the root, `useTheme` anywhere (theme names are typed from the registry). */
export const { ThemeProvider, useTheme } = createTheme({ registry: themeRegistry, storageKey: THEME_STORAGE_KEY });
