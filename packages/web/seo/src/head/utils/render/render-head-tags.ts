import type { HeadTags } from "../../types/head";
import { renderLink } from "./render-link";
import { renderTag } from "./render-tag";

/** The tags as HTML, one per line. */
export function renderHeadTags({ meta, links }: HeadTags) {
  return [...meta.map(renderTag), ...links.map(renderLink)]
    .map((line) => `    ${line}`)
    .join("\n");
}
