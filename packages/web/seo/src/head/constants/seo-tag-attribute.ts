/**
 * Attribute put on every tag written into the HTML for crawlers (by the server and by the build). The web app removes them at boot, because
 * the router writes the head again: left in place they would double its tags and keep the first page tags after navigation.
 */
export const SEO_TAG_ATTRIBUTE = "data-seo-tag";
