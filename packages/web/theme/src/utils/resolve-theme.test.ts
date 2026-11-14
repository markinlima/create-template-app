import { describe, expect, it } from "bun:test";

import { createThemeRegistry } from "../create-theme-registry";
import type { ThemeColors } from "../types/theme";
import { defineTheme } from "./define-theme";
import { resolveTheme } from "./resolve-theme";

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

describe("resolveTheme", () => {
  it("should use the chosen theme when it is allowed", () => {
    expect(resolveTheme({ registry, chosenName: "pro", userLevel: 2 })).toBe(
      pro,
    );
  });

  it("should fall back to the default when the level is too low", () => {
    expect(resolveTheme({ registry, chosenName: "pro", userLevel: 1 })).toBe(
      dark,
    );
  });

  it("should fall back to the default when the name doesn't exist", () => {
    expect(resolveTheme({ registry, chosenName: "gone", userLevel: 2 })).toBe(
      dark,
    );
  });
});
