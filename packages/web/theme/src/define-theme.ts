import type { Theme } from "./types";

/**
 * Defines a theme with full type checking (every color token is required) while keeping
 * the literal `name`, so the app can derive a union of its theme names.
 */
export function defineTheme<const TTheme extends Theme>(theme: TTheme): TTheme {
  return theme;
}
