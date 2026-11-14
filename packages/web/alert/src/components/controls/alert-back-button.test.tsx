import { describe, expect, it } from "bun:test";

import { makeAlert } from "../../test/make-alert";
import { renderInQueue } from "../../test/render-in-queue";
import { AlertBackButton } from "./alert-back-button";

describe("AlertBackButton", () => {
  it("draws nothing at the first alert", () => {
    expect(
      renderInQueue([makeAlert("a"), makeAlert("b")], <AlertBackButton />),
    ).toBe("");
  });
});
