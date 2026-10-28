import { describe, expect, it } from "vitest";

import { getAlertCooldown } from "./get-alert-cooldown";

describe("getAlertCooldown", () => {
  it("has nothing to wait for in a low importance alert", () => {
    expect(getAlertCooldown({ importance: "low" })).toBe(0);
  });

  it("has nothing to wait for in a high importance alert, which only needs to be read", () => {
    expect(getAlertCooldown({ importance: "high" })).toBe(0);
  });

  it("makes the button of a critical alert wait 5 seconds", () => {
    expect(getAlertCooldown({ importance: "critical" })).toBe(5);
  });

  it("takes the cooldown the alert asks for over the default", () => {
    expect(
      getAlertCooldown({ importance: "critical", cooldownSeconds: 10 }),
    ).toBe(10);
    expect(getAlertCooldown({ importance: "high", cooldownSeconds: 3 })).toBe(
      3,
    );
  });

  it("ignores a cooldown on an alert that doesn't need to be read", () => {
    expect(getAlertCooldown({ importance: "low", cooldownSeconds: 10 })).toBe(
      0,
    );
  });

  it("has nothing to wait for when the alert is read again", () => {
    expect(getAlertCooldown({ importance: "critical", isRevisit: true })).toBe(
      0,
    );
    expect(getAlertCooldown({ importance: "critical", isRevisit: false })).toBe(
      5,
    );
  });
});
