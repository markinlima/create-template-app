import type { StateStorage } from "zustand/middleware";

import type { Theme } from "./theme";
import type { ThemeRegistry } from "./theme-registry";

/** Options of {@link createThemeStore}. */
export interface CreateThemeStoreOptions<TThemes extends readonly Theme[]> {
  /** The app's themes. */
  registry: ThemeRegistry<TThemes>;
  /** Key where the chosen theme is persisted. */
  storageKey: string;
  /**
   * Where the choice is persisted.
   * @defaultValue `localStorage`, which may be blocked: the choice then lasts until the page closes.
   */
  storage?: StateStorage;
}
