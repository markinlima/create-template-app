import type { Theme } from "./theme";

/** State of the theme store. Only `chosenName` is persisted. */
export interface ThemeState<TName extends string = string> {
  /** Name of the theme the user picked. It may not be allowed at the moment; see `theme` of the hook for the one applied. */
  chosenName: TName;
  /** Level of the current user. Themes above it are not allowed. */
  userLevel: number;
  /** Tries to use the theme. Returns `false` (and changes nothing) if it doesn't exist or the user's level is too low. */
  setTheme: (name: TName) => boolean;
  /** Sets the level of the current user. */
  setUserLevel: (level: number) => void;
  /** Whether the current user's level allows the theme. */
  isThemeAllowed: (theme: Theme) => boolean;
}
