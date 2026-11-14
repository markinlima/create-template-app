import type { Theme } from "../types/theme";
import type { ThemeRegistry } from "../types/theme-registry";

/** Options of {@link resolveTheme}. */
export interface ResolveThemeOptions<TThemes extends readonly Theme[]> {
  registry: ThemeRegistry<TThemes>;
  chosenName: string;
  userLevel: number;
}

/**
 * Picks the theme to apply: the chosen one, or the default while the chosen one doesn't exist or is not allowed for `userLevel`.
 */
export function resolveTheme<TThemes extends readonly Theme[]>({
  registry,
  chosenName,
  userLevel,
}: ResolveThemeOptions<TThemes>): TThemes[number] {
  const chosenTheme = registry.getTheme(chosenName);

  return chosenTheme && registry.isThemeAllowed(chosenTheme, userLevel)
    ? chosenTheme
    : registry.defaultTheme;
}
