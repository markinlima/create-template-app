import type { Theme } from "./types";

export interface CreateThemeRegistryOptions<TThemes extends readonly Theme[]> {
  themes: TThemes;
  /** Name of the theme used when nothing is stored or the stored one is not allowed. Must have level `0`. */
  defaultThemeName: TThemes[number]["name"];
}

export interface ThemeRegistry<TThemes extends readonly Theme[]> {
  themes: TThemes;
  defaultTheme: TThemes[number];
  getTheme: (name: string) => TThemes[number] | undefined;
  /** Themes of exactly this level, dark ones first. */
  getThemesByLevel: (level: number) => TThemes[number][];
  /** Every level that has at least one theme, in ascending order. */
  levels: number[];
  isThemeAllowed: (theme: Theme, userLevel: number) => boolean;
}

/**
 * Groups the themes of an app and answers the questions the theme system needs:
 * which theme is this name, which themes belong to a level, is the user allowed to use it.
 */
export function createThemeRegistry<const TThemes extends readonly Theme[]>(
  options: CreateThemeRegistryOptions<TThemes>,
): ThemeRegistry<TThemes> {
  const { themes, defaultThemeName } = options;

  const names = new Set<string>();
  for (const theme of themes) {
    if (names.has(theme.name)) {
      throw new Error(`Duplicated theme name: "${theme.name}"`);
    }
    names.add(theme.name);
  }

  const defaultTheme = themes.find((theme) => theme.name === defaultThemeName);

  if (!defaultTheme) {
    throw new Error(
      `Default theme "${defaultThemeName}" is not in the themes list`,
    );
  }

  if (defaultTheme.level !== 0) {
    throw new Error(
      `Default theme "${defaultThemeName}" must be available to everyone (level 0)`,
    );
  }

  const levels = [...new Set(themes.map((theme) => theme.level))].sort(
    (a, b) => a - b,
  );

  return {
    themes,
    defaultTheme,
    levels,
    getTheme: (name) => themes.find((theme) => theme.name === name),
    getThemesByLevel: (level) =>
      themes
        .filter((theme) => theme.level === level)
        .sort(
          (a, b) => Number(b.scheme === "dark") - Number(a.scheme === "dark"),
        ),
    isThemeAllowed: (theme, userLevel) => userLevel >= theme.level,
  };
}
