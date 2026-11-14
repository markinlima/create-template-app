import { type ReactNode, useLayoutEffect } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { createThemeStore } from "./stores/create-theme-store";
import type { CreateThemeStoreOptions } from "./types/create-theme-store-options";
import type { Theme } from "./types/theme";
import { applyThemeToBody } from "./utils/apply-theme-to-body";
import { resolveTheme } from "./utils/resolve-theme";

/** Props of the `ThemeProvider` made by {@link createTheme}. */
export interface ThemeProviderProps {
  children: ReactNode;
  /** Level of the current user. Themes above it are not allowed. */
  userLevel: number;
}

/**
 * The theme of the app: keeps the chosen theme, applies it to the `<body>` and falls back to the default theme whenever the chosen one is
 * not allowed for the user's level (e.g. the subscription expired), without losing the choice if the level comes back.
 *
 * Call it once, in a file of its own, and use `ThemeProvider` once near the root and `useTheme` anywhere: they share one Zustand store, there
 * is no React context. The names of the themes are typed from the registry.
 *
 * @param options - See {@link CreateThemeStoreOptions}.
 * @returns `ThemeProvider`, `useTheme` and the `store` (`store.getState()` reads the theme outside React).
 */
export function createTheme<const TThemes extends readonly Theme[]>(
  options: CreateThemeStoreOptions<TThemes>,
) {
  const { registry } = options;
  const store = createThemeStore(options);

  function selectTheme(state: ReturnType<typeof store.getState>) {
    return resolveTheme({
      registry,
      chosenName: state.chosenName,
      userLevel: state.userLevel,
    });
  }

  /** Gives the user's level to the store and applies the theme to the body. Render it once, above everything that reads the theme. */
  function ThemeProvider({ children, userLevel }: ThemeProviderProps) {
    const theme = useStore(store, selectTheme);

    // NOTE: layout effects, so a change of level or theme lands before the browser paints
    useLayoutEffect(() => {
      store.getState().setUserLevel(userLevel);
    }, [userLevel]);

    useLayoutEffect(() => applyThemeToBody(theme), [theme]);

    return children;
  }

  /** The theme applied, the user's level and the actions to change it. `setTheme` returns `false` if the theme isn't allowed. */
  function useTheme() {
    return useStore(
      store,
      useShallow((state) => ({
        theme: selectTheme(state),
        userLevel: state.userLevel,
        setTheme: state.setTheme,
        isThemeAllowed: state.isThemeAllowed,
      })),
    );
  }

  return { ThemeProvider, useTheme, store };
}
