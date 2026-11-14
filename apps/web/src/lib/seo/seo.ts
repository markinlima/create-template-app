import { createSeo } from "@web/seo";

// ? A relative import: the Vite config loads this file before the `@` alias exists.
import { APP_CONFIG } from "../../core/info";

// FIXME: Placeholder. The title, description, keywords and image of the site: they are the defaults of every page.
/** What the app says about the site: the brand, and the tags every page shares. The pages and the build both read it from here. */
export const seo = createSeo({
	name: APP_CONFIG.brand.name,
	title: "Template App",
	description: APP_CONFIG.brand.description,
	keywords: "template, placeholder",
	imagePath: "/images/placeholder.svg",
	locale: "en_US",
});

export const { buildPageMeta, buildDefaultMeta } = seo;
