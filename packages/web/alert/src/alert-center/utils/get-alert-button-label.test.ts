import { describe, expect, it } from "vitest";

import { getAlertButtonLabel } from "./get-alert-button-label";

describe("getAlertButtonLabel", () => {
  it("says it understood when the alert is alone", () => {
    expect(
      getAlertButtonLabel({ alert: {}, isLast: true, hasSeveral: false }),
    ).toBe("Entendi");
  });

  it("says next while there are more alerts to come", () => {
    expect(
      getAlertButtonLabel({ alert: {}, isLast: false, hasSeveral: true }),
    ).toBe("Próximo");
  });

  it("says it is done at the last of several alerts", () => {
    expect(
      getAlertButtonLabel({ alert: {}, isLast: true, hasSeveral: true }),
    ).toBe("Concluir");
  });

  it("takes the text the alert asks for, wherever it is", () => {
    const alert = { buttonLabel: "Li e entendi" };

    expect(
      getAlertButtonLabel({ alert, isLast: true, hasSeveral: false }),
    ).toBe("Li e entendi");
    expect(
      getAlertButtonLabel({ alert, isLast: false, hasSeveral: true }),
    ).toBe("Li e entendi");
    expect(getAlertButtonLabel({ alert, isLast: true, hasSeveral: true })).toBe(
      "Li e entendi",
    );
  });
});
