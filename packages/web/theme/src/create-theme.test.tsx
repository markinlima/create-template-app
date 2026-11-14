import { describe, expect, it } from "bun:test";

import { renderToStaticMarkup } from "react-dom/server";

import { createTheme } from "./create-theme";
import { createThemeRegistry } from "./create-theme-registry";
import type { ThemeColors } from "./types/theme";
import { defineTheme } from "./utils/define-theme";

const colors = {} as ThemeColors;
const dark = defineTheme({
  name: "dark",
  displayName: "Dark",
  level: 0,
  scheme: "dark",
  colors,
});
const registry = createThemeRegistry({
  themes: [dark],
  defaultThemeName: "dark",
});

const memory = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

describe("createTheme", () => {
  it("should render the default theme through the hook", () => {
    const { useTheme } = createTheme({
      registry,
      storageKey: "k",
      storage: memory,
    });

    function Probe() {
      return <p>{useTheme().theme.name}</p>;
    }

    expect(renderToStaticMarkup(<Probe />)).toBe("<p>dark</p>");
  });
});
