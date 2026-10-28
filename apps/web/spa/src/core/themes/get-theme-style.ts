import type { CSSProperties } from "react";

/**
 * The inline style that gives an element the colors of a theme: every token becomes the CSS variable the theme
 * provider sets on the body (`--background`...), so what is inside shows as it would with the theme applied.
 */
export function getThemeStyle(colors: object) {
	return Object.fromEntries(Object.entries(colors).map(([token, value]) => [`--${token}`, value])) as CSSProperties;
}
