import { type HeadTags, injectHead, NO_INDEX } from "@web/seo/head";

/** Options of {@link renderHeadPage}. */
export interface RenderHeadPageOptions {
  /** The HTML shell of the app (its `index.html`). */
  shell: string;
  /** The tags of the page; they replace the ones of the same name the shell already has. */
  tags: Partial<HeadTags>;
  /** The headers every response of the server carries (the security ones). */
  headers: Record<string, string>;
  cacheControl: string;
  /** When it is not, the response says so in a header too (the tag is in `tags`). */
  indexable: boolean;
}

/** The response of a page whose tags come from data: the shell with the tags of the page in its head. */
export function renderHeadPage({
  shell,
  tags,
  headers,
  cacheControl,
  indexable,
}: RenderHeadPageOptions) {
  return new Response(
    injectHead(shell, { meta: tags.meta ?? [], links: tags.links ?? [] }),
    {
      headers: {
        ...headers,
        ...(!indexable && { "x-robots-tag": NO_INDEX }),
        "content-type": "text/html; charset=utf-8",
        "cache-control": cacheControl,
      },
    },
  );
}
