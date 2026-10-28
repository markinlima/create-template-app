interface WaitForOptions {
  /** Milliseconds to wait between attempts. Default: 50. */
  interval?: number;
  /** Maximum time to keep polling before failing. Default: 1000. */
  timeout?: number;
  /**
   * If true, it will resolve when the last value returned by `condition` is truthy.
   * Otherwise, it will resolve when the last execution did not throw an error.
   *
   * @default false
   */
  conditional?: boolean;
}

/**
 * Polls `condition` until it returns a truthy value (or stops throwing),
 * resolving with that value. Rejects if the timeout elapses first.
 *
 * Minimal stand-in for `node:test`'s `TestContext.waitFor`, which Bun's
 * test runner does not implement yet.
 */
export async function waitFor<T>(
  condition: () => T | Promise<T>,
  { interval = 50, timeout = 1000, conditional = false }: WaitForOptions = {},
): Promise<T> {
  const deadline = Date.now() + timeout;

  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      const result = await condition();

      if (conditional) {
        if (result) {
          return result;
        }
      } else {
        if (result) {
          return result;
        }

        return undefined as T;
      }
    } catch (error) {
      lastError = error;
    }

    await Bun.sleep(interval);
  }

  throw new Error(`waitFor timed out after ${timeout}ms`, {
    cause: lastError,
  });
}
