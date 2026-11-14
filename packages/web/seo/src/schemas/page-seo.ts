import { z } from "zod";

/** What a page says about itself, without the site's brand or the tags every page shares. */
export const pageSeoSchema = z.object({
  /** The title of the page, without the brand: it is added at the end. */
  title: z.string(),
  /** What the page is about, for search engines and previews. */
  description: z.string().optional(),
  /** Tells search engines not to index the page. */
  noIndex: z.boolean().optional(),
});

/** What a page says about itself for search engines and link previews. */
export type PageSeo = z.infer<typeof pageSeoSchema>;
