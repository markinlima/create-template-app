/**
 * Options of {@link getErrorMessage}.
 */
export interface GetErrorMessageOptions {
  /** Text shown when the error has no message to read. */
  fallback: string;
}

/**
 * Reads the text of a validation error. Accepts a plain string or an object with a `message`.
 *
 * @param error - The error as stored by TanStack Form (any validator can return it).
 * @param options - See {@link GetErrorMessageOptions}.
 * @returns The message, or `options.fallback` when the error has none.
 */
export function getErrorMessage(
  error: unknown,
  options: GetErrorMessageOptions,
) {
  if (typeof error === "string") {
    return error;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return options.fallback;
}
