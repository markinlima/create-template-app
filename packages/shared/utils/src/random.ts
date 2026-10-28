export function random<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error("Cannot pick a random value from an empty array.");
  }

  // biome-ignore lint/style/noNonNullAssertion: We check if the array is empty above, so we know that this will never be undefined.
  return array[Math.floor(Math.random() * array.length)]!;
}
