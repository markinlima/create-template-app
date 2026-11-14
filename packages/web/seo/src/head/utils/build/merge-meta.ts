import type { MetaTag } from "../../types/head";
import { getMetaKey } from "./get-meta-key";

/** Puts the lists together; a tag of a later list replaces the one with the same key, like a child route does with its parent's. */
export function mergeMeta(...lists: MetaTag[][]) {
  const merged = new Map<string, MetaTag>();

  for (const tag of lists.flat()) {
    merged.set(getMetaKey(tag), tag);
  }

  return [...merged.values()];
}
