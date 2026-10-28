import { createThemeRegistry } from "@web/theme";

import { blueMidnightTheme } from "./basic/blue-midnight";
import { crimsonAbyssTheme } from "./basic/crimson-abyss";
import { emeraldNightTheme } from "./basic/emerald-night";
import { amoledTheme } from "./free/amoled";
import { defaultTheme } from "./free/default";
import { lightTheme } from "./free/light";
import { themeLevels } from "./levels";
import { mintCreamTheme } from "./pro/mint-cream";
import { purpleDarkTheme } from "./pro/purple-dark";
import { skyLightTheme } from "./pro/sky-light";

export const themeRegistry = createThemeRegistry({
	themes: [
		defaultTheme,
		amoledTheme,
		lightTheme,
		blueMidnightTheme,
		crimsonAbyssTheme,
		emeraldNightTheme,
		mintCreamTheme,
		purpleDarkTheme,
		skyLightTheme,
	],
	defaultThemeName: "default",
});

export type ThemeName = (typeof themeRegistry.themes)[number]["name"];

export const freeThemes = themeRegistry.getThemesByLevel(themeLevels.free);

/** Every theme that needs a subscription, from the lowest level to the highest. */
export const premiumThemes = themeRegistry.levels.filter((level) => level > themeLevels.free).flatMap(themeRegistry.getThemesByLevel);
