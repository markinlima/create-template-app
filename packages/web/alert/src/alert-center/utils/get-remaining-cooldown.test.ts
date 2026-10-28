import { describe, expect, it } from "vitest";

import { getRemainingCooldown } from "./get-remaining-cooldown";

describe("getRemainingCooldown", () => {
  it("is the whole cooldown when it just started", () => {
    expect(
      getRemainingCooldown({ startedAt: 1000, now: 1000, cooldownSeconds: 5 }),
    ).toBe(5);
  });

  it("counts a second that already started as still left", () => {
    expect(
      getRemainingCooldown({ startedAt: 0, now: 100, cooldownSeconds: 5 }),
    ).toBe(5);
    expect(
      getRemainingCooldown({ startedAt: 0, now: 1100, cooldownSeconds: 5 }),
    ).toBe(4);
    expect(
      getRemainingCooldown({ startedAt: 0, now: 4999, cooldownSeconds: 5 }),
    ).toBe(1);
  });

  it("is 0 once the time is up, and never below", () => {
    expect(
      getRemainingCooldown({ startedAt: 0, now: 5000, cooldownSeconds: 5 }),
    ).toBe(0);
    expect(
      getRemainingCooldown({ startedAt: 0, now: 60000, cooldownSeconds: 5 }),
    ).toBe(0);
  });

  it("is 0 when there is no cooldown", () => {
    expect(
      getRemainingCooldown({ startedAt: 0, now: 0, cooldownSeconds: 0 }),
    ).toBe(0);
  });
});
