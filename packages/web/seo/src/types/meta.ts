/** What the app says about the whole site: the brand, and the tags every page shares. */
export interface SeoSite {
  /** The name of the brand, added at the end of the title of each page. */
  name: string;
  /** The title of the home, and the one every page has before it says its own. */
  title: string;
  description: string;
  keywords: string;
  /** The preview image, as a path of the site: the crawlers get the absolute address. */
  imagePath: string;
  /** The language of the site, e.g. `pt_BR`. */
  locale: string;
}
