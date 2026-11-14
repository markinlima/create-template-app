/**
 * Picks a random item of a list.
 *
 * @param items - The list to pick from.
 * @returns The item, or `undefined` when the list is empty.
 * @example
 * getRandomItem(["a", "b", "c"]); // "b"
 */
export function getRandomItem<T>(items: T[]) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}
