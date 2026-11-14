import { SEO_TAG_ATTRIBUTE } from "../head";

/**
 * Takes out the tags the build wrote into the HTML for the crawlers. From here on the router writes the head of each page by itself: left
 * in place, those tags would double the router's (it never replaces what came with the HTML), and the description and preview tags of the first page would stay first after the user navigates.
 */
export function removeSeoHeadTags(root: ParentNode = document) {
  for (const tag of root.querySelectorAll(`[${SEO_TAG_ATTRIBUTE}]`)) {
    tag.remove();
  }
}
