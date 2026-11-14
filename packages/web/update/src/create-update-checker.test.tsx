import { describe, expect, it } from "bun:test";

import { renderToStaticMarkup } from "react-dom/server";

import { createUpdateChecker } from "./create-update-checker";

/**
 * Renders a hook inside a component and reads back what it returned.
 * NOTE: the server render gives the initial state of the store (zustand's server snapshot), so only the state before a check is read here;
 * what a check changes is tested through the store (`stores/create-update-store.test.ts`).
 */
function readOnServer<T>(useValue: () => T): T {
  function Probe() {
    return <p>{JSON.stringify(useValue())}</p>;
  }

  const html = renderToStaticMarkup(<Probe />);

  return JSON.parse(html.replace(/<\/?p>/g, "").replaceAll("&quot;", '"'));
}

describe("createUpdateChecker", () => {
  it("has no update and no data before the first check", () => {
    const { useHasNewUpdate, useUpdateData } = createUpdateChecker({
      currentBuildId: "1",
    });

    expect(readOnServer(useHasNewUpdate)).toBe(false);
    expect(readOnServer(useUpdateData)).toBeNull();
  });

  it("has the same empty state in the combined hook", () => {
    const { useUpdateState } = createUpdateChecker({ currentBuildId: "1" });

    expect(readOnServer(useUpdateState)).toEqual({
      hasNewUpdate: false,
      data: null,
    });
  });

  it("gives a check function that is separate from the hooks", () => {
    const { check } = createUpdateChecker({ currentBuildId: "1" });

    expect(typeof check).toBe("function");
  });
});
