import { afterEach, describe, expect, it } from "bun:test";

import { stubGlobal, unstubAllGlobals } from "./stub-global";

describe("stubGlobal", () => {
  afterEach(() => {
    unstubAllGlobals();
  });

  it("replaces a global until it is unstubbed", () => {
    const before = globalThis.navigator;

    stubGlobal("navigator", { doNotTrack: "1" });
    expect(globalThis.navigator).toEqual({ doNotTrack: "1" } as Navigator);

    unstubAllGlobals();
    expect(globalThis.navigator).toBe(before);
  });

  it("removes a global that did not exist before", () => {
    stubGlobal("stubbedOnlyForThisTest", 1);
    expect(Reflect.get(globalThis, "stubbedOnlyForThisTest")).toBe(1);

    unstubAllGlobals();
    expect(Reflect.has(globalThis, "stubbedOnlyForThisTest")).toBe(false);
  });

  it("keeps the first original when a global is stubbed twice", () => {
    const before = globalThis.navigator;

    stubGlobal("navigator", {});
    stubGlobal("navigator", { locks: {} });
    unstubAllGlobals();

    expect(globalThis.navigator).toBe(before);
  });
});
