import { describe, expect, it } from "bun:test";

import { getAlertCooldown } from "./get-alert-cooldown";

describe("getAlertCooldown", () => {
  it("has nothing to wait for in a low importance alert", () => {
    expect(getAlertCooldown({ importance: "low" })).toBe(0);
  });

  it("has nothing to wait for in a medium importance alert, which only needs to be read", () => {
    expect(getAlertCooldown({ importance: "medium" })).toBe(0);
  });

  it("makes the button of a high importance alert wait 5 seconds", () => {
    expect(getAlertCooldown({ importance: "high" })).toBe(5);
  });

  it("takes the cooldown the alert asks for over the default", () => {
    expect(getAlertCooldown({ importance: "high", cooldownSeconds: 10 })).toBe(
      10,
    );
    expect(getAlertCooldown({ importance: "medium", cooldownSeconds: 3 })).toBe(
      3,
    );
  });

  it("ignores a cooldown on an alert that doesn't need to be read", () => {
    expect(getAlertCooldown({ importance: "low", cooldownSeconds: 10 })).toBe(
      0,
    );
  });

  it("has nothing to wait for when the alert is read again", () => {
    expect(getAlertCooldown({ importance: "high", isRevisit: true })).toBe(0);
    expect(getAlertCooldown({ importance: "high", isRevisit: false })).toBe(5);
  });
});
