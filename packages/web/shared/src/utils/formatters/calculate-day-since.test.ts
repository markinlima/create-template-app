import { describe, expect, it, setSystemTime } from "bun:test";

import { calculateDaysSince } from "./calculate-day-since";

describe("calculateDaysSince", () => {
  it("should return the correct number of days since a given date", () => {
    const date = new Date(2023, 10, 10);
    setSystemTime(new Date(2023, 10, 20));
    expect(calculateDaysSince(date)).toBe(10);
  });

  it("should handle string dates", () => {
    const date = "2023-11-10";
    setSystemTime(new Date(2023, 10, 20));
    expect(calculateDaysSince(date)).toBe(10);
  });

  it("should handle number (timestamp) dates", () => {
    const date = new Date(2023, 10, 10).getTime();
    setSystemTime(new Date(2023, 10, 20));
    expect(calculateDaysSince(date)).toBe(10);
  });

  it("should return 0 for the same day", () => {
    const date = new Date();
    expect(calculateDaysSince(date)).toBe(0);
  });
});
