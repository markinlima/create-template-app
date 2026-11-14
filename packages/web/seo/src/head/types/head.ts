/** One tag of the head, in the shape TanStack Router takes in `head().meta`. */
export type MetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string };

/** A `<link>` of the head. */
export interface LinkTag {
  rel: string;
  href: string;
}

/** The tags of the head of a page. */
export interface HeadTags {
  meta: MetaTag[];
  links: LinkTag[];
}
