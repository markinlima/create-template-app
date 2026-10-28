export function maybe<T>(value: T): T | null {
  return Math.random() > 0.5 ? value : null;
}
