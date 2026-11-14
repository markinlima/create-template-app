import { describe, expect, it } from "bun:test";

import { getAlertButtonLabel } from "./get-alert-button-label";

describe("getAlertButtonLabel", () => {
  it("says it understood when the alert is alone", () => {
    expect(getAlertButtonLabel({ isLast: true, hasSeveral: false })).toBe(
      "Entendi",
    );
  });

  it("says next while there are more alerts to come", () => {
    expect(getAlertButtonLabel({ isLast: false, hasSeveral: true })).toBe(
      "Próximo",
    );
  });

  it("says it is done at the last of several alerts", () => {
    expect(getAlertButtonLabel({ isLast: true, hasSeveral: true })).toBe(
      "Concluir",
    );
  });
});
