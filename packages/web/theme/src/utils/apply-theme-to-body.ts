import type { Theme } from "../types/theme";

/** The part of the `<body>` that {@link applyThemeToBody} touches. */
export interface ThemeTarget {
  style: Pick<CSSStyleDeclaration, "setProperty" | "removeProperty">;
  setAttribute: (name: string, value: string) => void;
  removeAttribute: (name: string) => void;
}

/**
 * Applies the theme to the body: a CSS variable per color, `data-theme` with its name and `data-scheme` with its scheme.
 *
 * @param theme - The theme to apply.
 * @param target - Element that receives it.
 * @defaultValue `document.body`
 * @returns A function that removes everything it applied.
 */
export function applyThemeToBody(
  theme: Theme,
  target: ThemeTarget = document.body,
) {
  const keys = Object.keys(theme.colors);

  for (const [key, value] of Object.entries(theme.colors)) {
    target.style.setProperty(`--${key}`, value);
  }
  target.setAttribute("data-theme", theme.name);
  target.setAttribute("data-scheme", theme.scheme);

  return () => {
    for (const key of keys) {
      target.style.removeProperty(`--${key}`);
    }
    target.removeAttribute("data-theme");
    target.removeAttribute("data-scheme");
  };
}
