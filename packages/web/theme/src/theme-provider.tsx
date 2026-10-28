import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";

import type { ThemeRegistry } from "./create-theme-registry";
import type { Theme } from "./types";

interface ThemeContextValue {
  registry: ThemeRegistry<readonly Theme[]>;
  /** Theme currently applied. */
  theme: Theme;
  /** Tries to use the theme. Returns `false` (and changes nothing) if it doesn't exist or the user's level is too low. */
  setTheme: (name: string) => boolean;
  isThemeAllowed: (theme: Theme) => boolean;
  userLevel: number;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  registry: ThemeRegistry<readonly Theme[]>;
  /** Level of the current user. Themes above it are not allowed. */
  userLevel: number;
  /** localStorage key where the chosen theme name is persisted. */
  storageKey: string;
}

function readStoredThemeName(storageKey: string) {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function storeThemeName(storageKey: string, name: string) {
  try {
    localStorage.setItem(storageKey, name);
  } catch {
    // ? Storage can be blocked (private mode, disabled site data); the choice just won't persist.
  }
}

/**
 * Keeps the chosen theme, applies it to the `<body>` (CSS variables and `data-scheme`) and
 * falls back to the default theme whenever the chosen one is not allowed for `userLevel`
 * (e.g. the subscription expired), without losing the choice if the level comes back.
 */
export function ThemeProvider({
  children,
  registry,
  userLevel,
  storageKey,
}: ThemeProviderProps) {
  const [chosenName, setChosenName] = useState<string>(
    registry.defaultTheme.name,
  );

  // ? Read on the client after mount so the server render and the first client render match.
  useEffect(() => {
    const storedName = readStoredThemeName(storageKey);
    if (storedName) {
      setChosenName(storedName);
    }
  }, [storageKey]);

  const isThemeAllowed = useCallback(
    (theme: Theme) => registry.isThemeAllowed(theme, userLevel),
    [registry, userLevel],
  );

  const chosenTheme = registry.getTheme(chosenName);
  const theme =
    chosenTheme && isThemeAllowed(chosenTheme)
      ? chosenTheme
      : registry.defaultTheme;

  const setTheme = useCallback(
    (name: string) => {
      const nextTheme = registry.getTheme(name);

      if (!nextTheme || !isThemeAllowed(nextTheme)) {
        return false;
      }

      setChosenName(nextTheme.name);
      storeThemeName(storageKey, nextTheme.name);
      return true;
    },
    [registry, isThemeAllowed, storageKey],
  );

  useEffect(() => {
    const body = document.body;
    const variables = Object.entries(theme.colors);

    for (const [key, value] of variables) {
      body.style.setProperty(`--${key}`, value);
    }
    body.setAttribute("data-scheme", theme.scheme);

    return () => {
      for (const [key] of variables) {
        body.style.removeProperty(`--${key}`);
      }
    };
  }, [theme]);

  return (
    <ThemeContext
      value={{ registry, theme, setTheme, isThemeAllowed, userLevel }}
    >
      {children}
    </ThemeContext>
  );
}

/**
 * Current theme and the actions to change it. Pass the union of the app's theme names to get
 * them typed (`useTheme<ThemeName>()`); the provider itself only knows them as strings.
 */
export function useTheme<TName extends string = string>() {
  const context = use(ThemeContext);

  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um <ThemeProvider>");
  }

  // ? The context is shared by every consumer so it can't carry the names; TName just narrows them.
  return context as unknown as Omit<ThemeContextValue, "theme" | "setTheme"> & {
    theme: Theme<TName>;
    setTheme: (name: TName) => boolean;
  };
}
