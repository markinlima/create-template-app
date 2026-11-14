import path from "node:path";

import type { Plugin } from "vite";

import type { Seo } from "../create-seo";
import { prerenderStaticPages } from "./prerender-static-pages";

/** Options of {@link seoPrerender}. */
export interface SeoPrerenderOptions {
  /** The SEO of the app, from `createSeo`. */
  seo: Seo;
  /** The public address of the site, e.g. `https://example.com`. */
  siteUrl: string;
  /** The folder of the route files, relative to the root of the app. @defaultValue "src/routes" */
  routesDirectory?: string;
}

/**
 * Runs after `vite build` writes the app: the tags of the site go into its `index.html`, and each route that declares `staticData: { prerender: true, seo }`
 * gets a static HTML page with its own tags. The pages with data (a shared post, collection or profile) are not here: the web server does
 * them on request.
 */
export function seoPrerender({
  seo,
  siteUrl,
  routesDirectory = "src/routes",
}: SeoPrerenderOptions): Plugin {
  let root = process.cwd();
  let outDir = "";

  return {
    name: "web-seo-prerender",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      // NOTE: a Nitro-style build also runs closeBundle for the server environment
      const environment = this.environment;

      if (environment && environment.name !== "client") {
        return;
      }

      await prerenderStaticPages({
        seo,
        siteUrl,
        outDir: environment
          ? path.resolve(root, environment.config.build.outDir)
          : outDir,
        routesDirectory: path.resolve(root, routesDirectory),
      });
    },
  };
}
