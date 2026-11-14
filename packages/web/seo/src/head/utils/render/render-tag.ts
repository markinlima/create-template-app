import { SEO_TAG_ATTRIBUTE } from "../../constants/seo-tag-attribute";
import type { MetaTag } from "../../types/head";
import { escapeHtml } from "../strings/escape-html";

/** One tag as HTML, marked with `SEO_TAG_ATTRIBUTE` so the web app can take it out when it starts. */
export function renderTag(tag: MetaTag) {
  if ("title" in tag) {
    return `<title ${SEO_TAG_ATTRIBUTE}>${escapeHtml(tag.title)}</title>`;
  }

  const [attribute, value] =
    "name" in tag
      ? (["name", tag.name] as const)
      : (["property", tag.property] as const);

  return `<meta ${SEO_TAG_ATTRIBUTE} ${attribute}="${escapeHtml(value)}" content="${escapeHtml(tag.content)}" />`;
}
