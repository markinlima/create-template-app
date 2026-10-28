import { afterEach, describe, expect, it, vi } from "vitest";

import { readSeenAlertIds } from "./read-seen-alert-ids";
import { writeSeenAlertIds } from "./write-seen-alert-ids";

function stubStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));

  vi.stubGlobal("localStorage", {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  });

  return data;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("seen alert ids", () => {
  it("reads back what was written", () => {
    stubStorage();

    writeSeenAlertIds("alerts:user-1", ["a", "b"]);

    expect(readSeenAlertIds("alerts:user-1")).toEqual(["a", "b"]);
  });

  it("keeps each key apart, so each user has their own", () => {
    stubStorage();

    writeSeenAlertIds("alerts:user-1", ["a"]);

    expect(readSeenAlertIds("alerts:user-2")).toEqual([]);
  });

  it("reads nothing when nothing was written", () => {
    stubStorage();

    expect(readSeenAlertIds("alerts:user-1")).toEqual([]);
  });

  it("reads nothing from a damaged value", () => {
    stubStorage({ "alerts:user-1": "{not json" });

    expect(readSeenAlertIds("alerts:user-1")).toEqual([]);
  });

  it("ignores what is not a list of ids", () => {
    stubStorage({
      "alerts:a": '{"id":"a"}',
      "alerts:b": '["a", 1, null, "b"]',
    });

    expect(readSeenAlertIds("alerts:a")).toEqual([]);
    expect(readSeenAlertIds("alerts:b")).toEqual(["a", "b"]);
  });

  it("doesn't break when the storage is unavailable", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    });

    expect(readSeenAlertIds("alerts:user-1")).toEqual([]);
    expect(() => writeSeenAlertIds("alerts:user-1", ["a"])).not.toThrow();
  });
});
