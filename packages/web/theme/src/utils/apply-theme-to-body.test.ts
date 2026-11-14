import { describe, expect, it } from "bun:test";

import type { Theme, ThemeColors } from "../types/theme";
import { applyThemeToBody } from "./apply-theme-to-body";

const theme: Theme = {
  name: "dark",
  displayName: "Dark",
  level: 0,
  scheme: "dark",
  colors: { background: "red", foreground: "blue" } as unknown as ThemeColors,
};

function createTarget() {
  const variables = new Map<string, string>();
  const attributes = new Map<string, string>();

  return {
    variables,
    attributes,
    style: {
      setProperty: (key: string, value: string) =>
        void variables.set(key, value),
      removeProperty: (key: string) => {
        const old = variables.get(key) ?? "";
        variables.delete(key);
        return old;
      },
    },
    setAttribute: (name: string, value: string) =>
      void attributes.set(name, value),
    removeAttribute: (name: string) => void attributes.delete(name),
  };
}

describe("applyThemeToBody", () => {
  it("should set the variables and attributes, and remove them on cleanup", () => {
    const target = createTarget();

    const cleanup = applyThemeToBody(theme, target);

    expect(Object.fromEntries(target.variables)).toEqual({
      "--background": "red",
      "--foreground": "blue",
    });
    expect(Object.fromEntries(target.attributes)).toEqual({
      "data-theme": "dark",
      "data-scheme": "dark",
    });

    cleanup();

    expect(target.variables.size).toBe(0);
    expect(target.attributes.size).toBe(0);
  });
});
