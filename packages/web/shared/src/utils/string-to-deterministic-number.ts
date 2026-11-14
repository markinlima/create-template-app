/** Options of {@link stringToDeterministicNumber}. */
export interface StringToDeterministicNumberOptions {
  /** The smallest number that can come out. */
  min: number;
  /** The biggest number that can come out. */
  max: number;
}

/**
 * Turns a string into a number from a range: the same string always gives the same number (an FNV-1a hash).
 *
 * @param input - The string to hash, e.g. a user id.
 * @param options - See {@link StringToDeterministicNumberOptions}.
 * @returns An integer from `min` to `max`, both included.
 * @example
 * stringToDeterministicNumber("user-1", { min: 1, max: 5 }); // always the same number from 1 to 5
 */
export function stringToDeterministicNumber(
  input: string,
  { min, max }: StringToDeterministicNumberOptions,
): number {
  let hash = 2166136261; // NOTE: the 32-bit FNV-1a offset basis
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  hash = hash >>> 0; // NOTE: unsigned shift keeps the hash a positive 32-bit integer

  const range = max - min + 1;

  return (hash % range) + min;
}
