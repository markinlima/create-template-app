/** The outcome of {@link safer}. */
export interface SaferResult<T> {
  /** Whether the callback finished without throwing. */
  success: boolean;
  /** What the callback returned, or `null` when it threw or returned nothing. */
  data: T | null;
  /** What the callback threw, when it did. */
  error?: Error | null;
}

/**
 * Runs a callback and catches what it throws, so the caller checks `success` instead of using `try`/`catch`.
 *
 * @param callback - The function to run.
 * @returns See {@link SaferResult}. A callback that returns `undefined` gives `data: null`.
 * @example
 * const { success, data } = safer(() => JSON.parse(text));
 */
export function safer<T = void>(callback: () => T): SaferResult<T> {
  try {
    const data = callback();
    return { success: true, data: data ?? null };
  } catch (error) {
    return { success: false, data: null, error: error as Error };
  }
}
