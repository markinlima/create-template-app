import { afterEach, describe, expect, it, spyOn } from "bun:test";

import { stubGlobal, unstubAllGlobals } from "@shared/utils/test";

import { pruneSeenAlertIds } from "./prune-seen-alert-ids";
import { readSeenAlertIds } from "./read-seen-alert-ids";

function stubStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));

  stubGlobal("localStorage", {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  });

  return data;
}

afterEach(() => {
  unstubAllGlobals();
});

describe("pruneSeenAlertIds", () => {
  it("removes from the storage the ids that are not in the list of alerts any more", () => {
    stubStorage({ "alerts:user-1": '["old", "kept", "gone"]' });

    const kept = pruneSeenAlertIds("alerts:user-1", ["kept", "new"]);

    expect(kept).toEqual(["kept"]);
    expect(readSeenAlertIds("alerts:user-1")).toEqual(["kept"]);
  });

  it("keeps the ids of alerts that are still in the list, seen or not", () => {
    stubStorage({ "alerts:user-1": '["a", "b"]' });

    pruneSeenAlertIds("alerts:user-1", ["a", "b", "c"]);

    expect(readSeenAlertIds("alerts:user-1")).toEqual(["a", "b"]);
  });

  it("empties the storage when the list has none of the saved ids", () => {
    stubStorage({ "alerts:user-1": '["a", "b"]' });

    pruneSeenAlertIds("alerts:user-1", []);

    expect(readSeenAlertIds("alerts:user-1")).toEqual([]);
  });

  it("writes nothing when there is nothing to remove", () => {
    const data = stubStorage({ "alerts:user-1": '["a"]' });
    const setItem = spyOn(localStorage, "setItem");

    pruneSeenAlertIds("alerts:user-1", ["a"]);

    expect(setItem).not.toHaveBeenCalled();
    expect(data.get("alerts:user-1")).toBe('["a"]');
  });

  it("only touches the key it was given", () => {
    stubStorage({
      "alerts:user-1": '["a"]',
      "alerts:user-2": '["a", "b"]',
    });

    pruneSeenAlertIds("alerts:user-1", []);

    expect(readSeenAlertIds("alerts:user-2")).toEqual(["a", "b"]);
  });

  it("does nothing, without failing, when the storage is damaged or unavailable", () => {
    stubStorage({ "alerts:user-1": "{not json" });

    expect(pruneSeenAlertIds("alerts:user-1", ["a"])).toEqual([]);

    stubGlobal("localStorage", undefined);

    expect(() => pruneSeenAlertIds("alerts:user-1", ["a"])).not.toThrow();
  });
});
