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
 * Polls `condition`, resolving with the value it returned. By default it
 * resolves as soon as `condition` does not throw (whatever the value, even a
 * falsy one); with `conditional: true` it waits for a truthy value. Rejects
 * if the timeout elapses first, with the last error as the `cause`.
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

      if (!conditional || result) {
        return result;
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
