import { describe, expect, it } from "bun:test";

import { waitFor } from "./wait-for";

describe("util: waitFor", () => {
  describe("default mode", () => {
    it("should resolve with the value the condition returns", async () => {
      expect(await waitFor(() => "value")).toBe("value");
    });

    it.each([
      ["0", 0],
      ["false", false],
      ["an empty string", ""],
      ["null", null],
    ])(
      "should resolve with %s instead of waiting for a truthy value",
      async (_, value) => {
        expect(await waitFor(() => value, { timeout: 200 })).toBe(value);
      },
    );

    it("should resolve with undefined when the condition returns undefined", async () => {
      expect(await waitFor(() => undefined)).toBeUndefined();
    });

    it("should retry until the condition stops throwing", async () => {
      let attempts = 0;

      const result = await waitFor(
        () => {
          attempts++;

          if (attempts < 3) {
            throw new Error("not yet");
          }

          return "done";
        },
        { interval: 5 },
      );

      expect(result).toBe("done");
      expect(attempts).toBe(3);
    });

    it("should support async conditions", async () => {
      expect(await waitFor(async () => "async")).toBe("async");
    });

    it("should reject with the last error as the cause when it times out", async () => {
      const lastError = new Error("always failing");

      const promise = waitFor(
        () => {
          throw lastError;
        },
        { interval: 5, timeout: 50 },
      );

      await expect(promise).rejects.toThrow("waitFor timed out after 50ms");
      await expect(promise).rejects.toHaveProperty("cause", lastError);
    });
  });

  describe("conditional mode", () => {
    it("should wait until the condition returns a truthy value", async () => {
      let attempts = 0;

      const result = await waitFor(() => ++attempts >= 3 && "ready", {
        conditional: true,
        interval: 5,
      });

      expect(result).toBe("ready");
      expect(attempts).toBe(3);
    });

    it("should keep retrying while the condition throws", async () => {
      let attempts = 0;

      const result = await waitFor(
        () => {
          if (++attempts < 2) {
            throw new Error("not yet");
          }

          return true;
        },
        { conditional: true, interval: 5 },
      );

      expect(result).toBe(true);
    });

    it("should reject when the condition never becomes truthy", async () => {
      await expect(
        waitFor(() => false, { conditional: true, interval: 5, timeout: 50 }),
      ).rejects.toThrow("waitFor timed out after 50ms");
    });
  });
});
