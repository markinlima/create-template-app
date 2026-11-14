import type { Theme } from "./theme";

/** The themes of an app, grouped and validated by {@link createThemeRegistry}. */
export interface ThemeRegistry<TThemes extends readonly Theme[]> {
  /** Every theme of the app, in the order they were given. */
  themes: TThemes;
  /** Theme used when nothing is chosen or the chosen one is not allowed. Always level `0`. */
  defaultTheme: TThemes[number];
  /** Finds a theme by its name, or `undefined` when there is none. */
  getTheme: (name: string) => TThemes[number] | undefined;
  /** Themes of exactly this level, dark ones first. */
  getThemesByLevel: (level: number) => TThemes[number][];
  /** Every level that has at least one theme, in ascending order. */
  levels: number[];
  /** Whether a user of `userLevel` may use the theme. */
  isThemeAllowed: (theme: Theme, userLevel: number) => boolean;
}
