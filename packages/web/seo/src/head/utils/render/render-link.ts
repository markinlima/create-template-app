import { SEO_TAG_ATTRIBUTE } from "../../constants/seo-tag-attribute";
import type { LinkTag } from "../../types/head";
import { escapeHtml } from "../strings/escape-html";

/** One `<link>` as HTML, marked with `SEO_TAG_ATTRIBUTE` like the meta tags. */
export function renderLink(link: LinkTag) {
  return `<link ${SEO_TAG_ATTRIBUTE} rel="${escapeHtml(link.rel)}" href="${escapeHtml(link.href)}" />`;
}
