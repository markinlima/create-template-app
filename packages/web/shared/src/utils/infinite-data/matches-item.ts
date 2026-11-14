/**
 * Whether an item of a cache matches `where`. A key such as `["User"]` also matches caches of other shapes (the statistics
 * of a user, for example), whose items `where` doesn't expect and may throw on: those just don't match.
 */
export function matchesItem<T>(
  where: (data: Readonly<T>) => boolean,
  item: unknown,
) {
  try {
    return where(item as T);
  } catch {
    return false;
  }
}
