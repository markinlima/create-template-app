import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { safeStorage } from "../lib/safe-storage";
import type { CreateThemeStoreOptions } from "../types/create-theme-store-options";
import type { Theme } from "../types/theme";
import type { ThemeState } from "../types/theme-state";

/**
 * The theme state (a Zustand store): the name the user chose, persisted, and the user's level. A chosen theme that is not allowed
 * is kept, so it comes back if the level does.
 *
 * @param options - See {@link CreateThemeStoreOptions}.
 * @returns The vanilla store.
 */
export function createThemeStore<const TThemes extends readonly Theme[]>({
  registry,
  storageKey,
  storage = safeStorage,
}: CreateThemeStoreOptions<TThemes>) {
  type Name = TThemes[number]["name"];

  return createStore<ThemeState<Name>>()(
    persist(
      (set, get) => ({
        chosenName: registry.defaultTheme.name,
        userLevel: 0,
        setTheme: (name) => {
          const theme = registry.getTheme(name);

          if (!theme || !registry.isThemeAllowed(theme, get().userLevel)) {
            return false;
          }

          set({ chosenName: theme.name });
          return true;
        },
        setUserLevel: (level) => set({ userLevel: level }),
        isThemeAllowed: (theme) =>
          registry.isThemeAllowed(theme, get().userLevel),
      }),
      {
        name: storageKey,
        version: 1,
        storage: createJSONStorage(() => storage),
        partialize: (state) => ({ chosenName: state.chosenName }),
      },
    ),
  );
}
