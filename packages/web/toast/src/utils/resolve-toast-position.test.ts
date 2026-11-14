import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { stubGlobal, unstubAllGlobals } from "@shared/utils/test";

import { toastConfig } from "../lib/toast-config";
import { resolveToastPosition } from "./resolve-toast-position";

function stubViewport(matches: boolean) {
  stubGlobal("window", { matchMedia: () => ({ matches }) });
}

beforeEach(() => {
  stubViewport(false);
});

afterEach(() => {
  unstubAllGlobals();
  toastConfig.defaultPosition = "bottom-right";
});

describe("resolveToastPosition", () => {
  it("keeps the requested position on desktop", () => {
    expect(resolveToastPosition("bottom-left")).toBe("bottom-left");
  });

  it("uses the configured default when no position is requested", () => {
    toastConfig.defaultPosition = "top-right";

    expect(resolveToastPosition()).toBe("top-right");
  });

  it("always uses the top on mobile", () => {
    stubViewport(true);

    expect(resolveToastPosition("bottom-left")).toBe("top-center");
  });
});
