import { describe, expect, it, jest } from "bun:test";

import { sleep } from "./sleep";

jest.useFakeTimers();

describe("sleep", () => {
  it("should resolve after the specified time", async () => {
    const sleepTime = 1000;
    const promise = sleep(sleepTime);

    jest.advanceTimersByTime(sleepTime);

    await expect(promise).resolves.toBeUndefined();
  });
});
