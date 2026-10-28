interface SafferResult<T> {
  success: boolean;
  data: T | null;
  error?: Error | null;
}
/** * Executes a callback function safely, catching any errors that may occur.
 * Returns an object indicating whether the operation was successful, the resulting data (or null if unsuccessful), and any error that was caught.
 *
 * @param props - An object containing the callback function to execute and an error handling function.
 * @returns An object with success status, data, and optionally an error.
 */
export function saffer<T = void>(callback: () => T): SafferResult<T> {
  try {
    const data = callback();
    return { success: true, data: data ?? null };
  } catch (error) {
    return { success: false, data: null, error: error as Error };
  }
}
