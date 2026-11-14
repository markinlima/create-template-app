import { defineWebServer } from "@web/server/config";

import { buildSecurityHeaders } from "./constants/build-security-headers";
import {
	BUILD_INFO_PATH,
	CACHE_ALWAYS_ASK,
	CACHE_FIVE_MINUTES,
	CACHE_ONE_DAY,
	CACHE_ONE_YEAR_IMMUTABLE,
	HASHED_ASSETS_PATH,
	PUBLIC_FILES_PATH,
	SERVICE_WORKER_PATH,
} from "./constants/cache-rules";
import { serverEnv } from "./constants/server-env";

/**
 * How the web server (`@web/server`) serves the build. The browser keeps what it can, so the server answers as few requests as possible:
 * the hashed files for a year, the files of `public/` (no hash in their name) for a day and the HTML, which names the current hashed files,
 * for five minutes, which is how long a tab can hold a page of the build that was replaced. Only the files that tell the app a new build
 * exists are asked again every time.
 */
export default defineWebServer({
	securityHeaders: () => buildSecurityHeaders({ umamiUrl: process.env.VITE_UMAMI_URL }),
	cacheRules: [
		{ match: HASHED_ASSETS_PATH, cacheControl: CACHE_ONE_YEAR_IMMUTABLE },
		{ match: PUBLIC_FILES_PATH, cacheControl: CACHE_ONE_DAY },
		{ match: SERVICE_WORKER_PATH, cacheControl: CACHE_ALWAYS_ASK },
		{ match: BUILD_INFO_PATH, cacheControl: CACHE_ALWAYS_ASK },
	],
	defaultCacheControl: CACHE_FIVE_MINUTES,
	api: {
		url: () => serverEnv.VITE_API_URL,
		version: () => serverEnv.VITE_API_VERSION,
		headers: { "x-device-platform": "WEB", "user-agent": "web-server" },
	},
});
