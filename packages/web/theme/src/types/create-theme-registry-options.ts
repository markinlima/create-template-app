import type { Theme } from "./theme";

/** Options of {@link createThemeRegistry}. */
export interface CreateThemeRegistryOptions<TThemes extends readonly Theme[]> {
  /** Every theme of the app. Names must be unique. */
  themes: TThemes;
  /** Name of the theme used when nothing is stored or the stored one is not allowed. Must have level `0`. */
  defaultThemeName: TThemes[number]["name"];
}
