// ? The addresses and the `Cache-Control` values of the cache rules in `web-server.config.ts`.

/** The folder of the files with a hash in their name (the build puts them there). */
export const HASHED_ASSETS_PATH = "/assets/";

/** The files of `public/` the app uses (no hash in their name, so a new build can replace them). */
export const PUBLIC_FILES_PATH = /^\/(images|videos|meta)\//;

/** The service worker and the scripts it loads (`sw.js`, `registerSW.js`, `workbox-<hash>.js`). */
export const SERVICE_WORKER_PATH = /^\/(sw|registerSW|workbox-[\w-]+)\.js$/;

/** The files that tell the app a new build exists: the one the update notice reads and the manifest. */
export const BUILD_INFO_PATH = /^\/(version\.json|manifest\.webmanifest)$/;

/** A file that never changes: the browser keeps it for a year and never asks again. */
export const CACHE_ONE_YEAR_IMMUTABLE = "public, max-age=31536000, immutable";

/** A file that can change in a new build, but not often. */
export const CACHE_ONE_DAY = "public, max-age=86400";

/** A file that must be asked again every time (the browser keeps it, but checks it is still the current one). */
export const CACHE_ALWAYS_ASK = "no-cache";

/** The HTML, which names the current hashed files: five minutes is how long a tab can hold a page of a replaced build. */
export const CACHE_FIVE_MINUTES = "public, max-age=300";
