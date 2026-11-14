import { afterEach, describe, expect, it } from "bun:test";

import { browserEvents } from "./browser-events";

function fakeDocument(visibilityState: DocumentVisibilityState) {
  return Object.assign(new EventTarget(), {
    visibilityState,
  }) as unknown as Document;
}

function setGlobal(name: "document" | "window", value: unknown) {
  Object.defineProperty(globalThis, name, {
    value,
    configurable: true,
    writable: true,
  });
}

afterEach(() => {
  Reflect.deleteProperty(globalThis, "document");
  Reflect.deleteProperty(globalThis, "window");
});

describe("browserEvents.onTabVisible", () => {
  it("calls the callback when the tab comes back to the front", () => {
    const doc = fakeDocument("visible");
    setGlobal("document", doc);
    let calls = 0;

    browserEvents.onTabVisible(() => calls++);
    doc.dispatchEvent(new Event("visibilitychange"));

    expect(calls).toBe(1);
  });

  it("ignores the change when the tab goes to the background", () => {
    const doc = fakeDocument("hidden");
    setGlobal("document", doc);
    let calls = 0;

    browserEvents.onTabVisible(() => calls++);
    doc.dispatchEvent(new Event("visibilitychange"));

    expect(calls).toBe(0);
  });

  it("stops calling the callback once the returned function runs", () => {
    const doc = fakeDocument("visible");
    setGlobal("document", doc);
    let calls = 0;

    const stop = browserEvents.onTabVisible(() => calls++);
    stop();
    doc.dispatchEvent(new Event("visibilitychange"));

    expect(calls).toBe(0);
  });
});

describe("browserEvents.onPreloadError", () => {
  it("calls the callback when Vite fails to load a lazy chunk", () => {
    const win = new EventTarget();
    setGlobal("window", win);
    let calls = 0;

    browserEvents.onPreloadError(() => calls++);
    win.dispatchEvent(new Event("vite:preloadError"));

    expect(calls).toBe(1);
  });

  it("stops calling the callback once the returned function runs", () => {
    const win = new EventTarget();
    setGlobal("window", win);
    let calls = 0;

    const stop = browserEvents.onPreloadError(() => calls++);
    stop();
    win.dispatchEvent(new Event("vite:preloadError"));

    expect(calls).toBe(0);
  });
});
