import type { HeadTags, MetaTag } from "../../types/head";

/**
 * One option per thing a page says. Each option is written to every tag that carries it: `title` is the `<title>`, `og:title` and
 * `twitter:title`, and `description`, `url` and `image` go to Open Graph and Twitter the same way. A tag is only written when its value is
 * given, so a page passes what it has and nothing else.
 */
export interface BuildMetaOptions {
  /** The title of the page: the `<title>`, `og:title` and `twitter:title`. */
  title?: string;
  /** The `description`, `og:description` and `twitter:description`. */
  description?: string;
  keywords?: string;
  author?: string;
  /** The name of the app, for browsers and phones (`application-name`). */
  applicationName?: string;
  /** The `referrer` policy of the page. */
  referrer?: string;
  /** The `robots` directive, e.g. `noindex, nofollow`. */
  robots?: string;
  /** The color of the browser tab on a phone and of the border of the Discord embed. */
  themeColor?: string;
  /** The name of the site (`og:site_name`). */
  siteName?: string;
  /** The language of the content, e.g. `pt_BR` (`og:locale`). */
  locale?: string;
  /** @example "website", "article", "profile", "video.other" (`og:type`) */
  type?: string;
  /** The public address of the page: `og:url` and `twitter:url`. */
  url?: string;
  /** The preview image, absolute: `og:image` and `twitter:image`. */
  image?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
  /** @example "summary", "summary_large_image" */
  twitterCard?: string;
  /** The handle of the author on X, e.g. `@foxy`. */
  twitterCreator?: string;
  /** The username of the author, for `article:author`. */
  articleAuthor?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string | null;
  /** The `<link rel="canonical">` of the page. */
  canonical?: string;
}

/** The tags of a page: the `<title>`, the `<meta>` tags and the `<link>` tags, for the options that are given. */
export function buildMeta({
  title,
  description,
  keywords,
  author,
  applicationName,
  referrer,
  robots,
  themeColor,
  siteName,
  locale,
  type,
  url,
  image,
  imageWidth,
  imageHeight,
  twitterCard,
  twitterCreator,
  articleAuthor,
  articlePublishedTime,
  articleModifiedTime,
  canonical,
}: BuildMetaOptions = {}): HeadTags {
  const meta: MetaTag[] = [];

  const name = (tagName: string, content?: string | null) => {
    if (content) {
      meta.push({ name: tagName, content });
    }
  };

  const property = (tagProperty: string, content?: string | null) => {
    if (content) {
      meta.push({ property: tagProperty, content });
    }
  };

  if (title) {
    meta.push({ title });
  }

  name("description", description);
  name("keywords", keywords);
  name("author", author);
  name("application-name", applicationName);
  name("referrer", referrer);
  name("robots", robots);
  name("theme-color", themeColor);

  property("og:title", title);
  property("og:description", description);
  property("og:url", url);
  property("og:site_name", siteName);
  property("og:image", image);
  property("og:image:width", imageWidth?.toString());
  property("og:image:height", imageHeight?.toString());
  property("og:type", type);
  property("og:locale", locale);

  name("twitter:card", twitterCard);
  name("twitter:title", title);
  name("twitter:description", description);
  name("twitter:url", url);
  name("twitter:image", image);
  name("twitter:creator", twitterCreator);

  property("article:author", articleAuthor);
  property("article:published_time", articlePublishedTime);
  property("article:modified_time", articleModifiedTime);

  return {
    meta,
    links: canonical ? [{ rel: "canonical", href: canonical }] : [],
  };
}
