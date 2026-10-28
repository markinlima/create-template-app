import { describe, expect, it } from "vitest";

import {
  isKeyboardNavigationActive,
  registerKeyboardNavigation,
} from "./keyboard-navigation-stack";

describe("keyboard navigation stack", () => {
  it("should only activate the newest registered list", () => {
    const page = Symbol("page");
    const dialog = Symbol("dialog");

    const unregisterPage = registerKeyboardNavigation(page);
    expect(isKeyboardNavigationActive(page)).toBe(true);

    const unregisterDialog = registerKeyboardNavigation(dialog);
    expect(isKeyboardNavigationActive(dialog)).toBe(true);
    expect(isKeyboardNavigationActive(page)).toBe(false);

    unregisterDialog();
    expect(isKeyboardNavigationActive(page)).toBe(true);

    unregisterPage();
    expect(isKeyboardNavigationActive(page)).toBe(false);
  });

  it("should ignore a list that was never registered", () => {
    expect(isKeyboardNavigationActive(Symbol("none"))).toBe(false);
  });

  it("should not break when unregistering twice", () => {
    const id = Symbol("list");
    const unregister = registerKeyboardNavigation(id);

    unregister();

    expect(() => unregister()).not.toThrow();
  });
});
