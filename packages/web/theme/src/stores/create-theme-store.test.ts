import { describe, expect, it } from "bun:test";

import { createThemeRegistry } from "../create-theme-registry";
import type { ThemeColors } from "../types/theme";
import { defineTheme } from "../utils/define-theme";
import { createThemeStore } from "./create-theme-store";

const colors = {} as ThemeColors;
const dark = defineTheme({
  name: "dark",
  displayName: "Dark",
  level: 0,
  scheme: "dark",
  colors,
});
const pro = defineTheme({
  name: "pro",
  displayName: "Pro",
  level: 2,
  scheme: "dark",
  colors,
});
const registry = createThemeRegistry({
  themes: [dark, pro],
  defaultThemeName: "dark",
});

function createMemoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));

  return {
    data,
    getItem: (name: string) => data.get(name) ?? null,
    setItem: (name: string, value: string) => void data.set(name, value),
    removeItem: (name: string) => void data.delete(name),
  };
}

describe("createThemeStore", () => {
  it("should start with the default theme and level 0", () => {
    const store = createThemeStore({
      registry,
      storageKey: "k",
      storage: createMemoryStorage(),
    });

    expect(store.getState().chosenName).toBe("dark");
    expect(store.getState().userLevel).toBe(0);
  });

  it("should refuse a theme that doesn't exist or isn't allowed", () => {
    const store = createThemeStore({
      registry,
      storageKey: "k",
      storage: createMemoryStorage(),
    });

    expect(store.getState().setTheme("pro")).toBe(false);
    // @ts-expect-error a name outside the union, as a caller without types could pass
    expect(store.getState().setTheme("nope")).toBe(false);
    expect(store.getState().chosenName).toBe("dark");
  });

  it("should accept an allowed theme and persist only the name", () => {
    const storage = createMemoryStorage();
    const store = createThemeStore({ registry, storageKey: "k", storage });

    store.getState().setUserLevel(2);

    expect(store.getState().setTheme("pro")).toBe(true);
    expect(JSON.parse(storage.data.get("k") ?? "")).toEqual({
      state: { chosenName: "pro" },
      version: 1,
    });
  });

  it("should restore the stored choice and keep it while the level is low", () => {
    const storage = createMemoryStorage({
      k: JSON.stringify({ state: { chosenName: "pro" }, version: 1 }),
    });
    const store = createThemeStore({ registry, storageKey: "k", storage });

    expect(store.getState().chosenName).toBe("pro");
    expect(store.getState().isThemeAllowed(pro)).toBe(false);

    store.getState().setUserLevel(2);

    expect(store.getState().isThemeAllowed(pro)).toBe(true);
  });
});
