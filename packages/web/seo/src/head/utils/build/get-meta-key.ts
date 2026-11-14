import type { MetaTag } from "../../types/head";

/** What identifies a tag, so two tags with the same key are the same tag: there is one title, and one tag per `name` or `property`. */
export function getMetaKey(tag: MetaTag) {
  if ("title" in tag) {
    return "title";
  }

  return "name" in tag ? `name:${tag.name}` : `property:${tag.property}`;
}
