import type { ThemeColors } from "./types";

/** Converts the theme colors to CSS variable declarations, e.g. `--background: hsl(...);`. */
export function convertThemeToCss(colors: Partial<ThemeColors>) {
  return Object.entries(colors)
    .map(([key, value]) => `--${key}: ${value};`)
    .join("");
}
