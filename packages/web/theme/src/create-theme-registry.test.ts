import { describe, expect, it } from "vitest";

import { createThemeRegistry } from "./create-theme-registry";
import { defineTheme } from "./define-theme";
import type { ThemeColors } from "./types";

const colors = new Proxy({}, { get: () => "red" }) as ThemeColors;

const dark = defineTheme({
  name: "dark",
  displayName: "Dark",
  level: 0,
  scheme: "dark",
  colors,
});
const light = defineTheme({
  name: "light",
  displayName: "Light",
  level: 0,
  scheme: "light",
  colors,
});
const proLight = defineTheme({
  name: "proLight",
  displayName: "Pro Light",
  level: 2,
  scheme: "light",
  colors,
});
const proDark = defineTheme({
  name: "proDark",
  displayName: "Pro Dark",
  level: 2,
  scheme: "dark",
  colors,
});

describe("createThemeRegistry", () => {
  const registry = createThemeRegistry({
    themes: [light, proLight, dark, proDark],
    defaultThemeName: "dark",
  });

  it("should find a theme by name", () => {
    expect(registry.getTheme("proDark")).toBe(proDark);
    expect(registry.getTheme("nope")).toBeUndefined();
  });

  it("should expose the default theme", () => {
    expect(registry.defaultTheme).toBe(dark);
  });

  it("should list the levels in ascending order", () => {
    expect(registry.levels).toEqual([0, 2]);
  });

  it("should group themes by level with dark ones first", () => {
    expect(registry.getThemesByLevel(0).map((theme) => theme.name)).toEqual([
      "dark",
      "light",
    ]);
    expect(registry.getThemesByLevel(2).map((theme) => theme.name)).toEqual([
      "proDark",
      "proLight",
    ]);
    expect(registry.getThemesByLevel(1)).toEqual([]);
  });

  it("should only allow themes up to the user level", () => {
    expect(registry.isThemeAllowed(proDark, 1)).toBe(false);
    expect(registry.isThemeAllowed(proDark, 2)).toBe(true);
    expect(registry.isThemeAllowed(dark, 0)).toBe(true);
  });

  it("should reject duplicated names", () => {
    expect(() =>
      createThemeRegistry({ themes: [dark, dark], defaultThemeName: "dark" }),
    ).toThrow("Duplicated");
  });

  it("should require the default theme to be free", () => {
    expect(() =>
      createThemeRegistry({
        themes: [dark, proDark],
        defaultThemeName: "proDark",
      }),
    ).toThrow("level 0");
  });
});
