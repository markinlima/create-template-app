export function dedupe<T>(array: T[]) {
  return Array.from(new Set(array));
}
