import type { HeadTags } from "../../types/head";
import { removeExistingTags } from "../build/remove-existing-tags";
import { renderHeadTags } from "./render-head-tags";

/** Adds the tags to the end of the `<head>` of the shell, replacing the ones with the same title, name, property or rel. */
export function injectHead(html: string, tags: HeadTags) {
  const cleaned = removeExistingTags(html, tags);
  const headEnd = cleaned.search(/<\/head>/i);

  if (headEnd === -1) {
    return cleaned;
  }

  return `${cleaned.slice(0, headEnd)}${renderHeadTags(tags)}\n  ${cleaned.slice(headEnd)}`;
}
