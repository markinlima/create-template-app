import { VitePWA } from "vite-plugin-pwa";

// ? A relative import: the Vite config loads this file before the `@` alias exists.
import { APP_CONFIG } from "../../core/info";

/**
 * The PWA plugin: the manifest and the service worker (what it caches and what it never does). Kept apart from `vite.config.ts`
 * because its options are long. The PWA options below are placeholders (FIXME): replace them with the identity of the project.
 */
export function setupPwa() {
	const plugins = VitePWA({
		registerType: "autoUpdate",
		injectRegister: "auto",
		manifest: {
			id: "/",
			name: APP_CONFIG.brand.name, // FIXME: placeholder
			short_name: APP_CONFIG.brand.name, // FIXME: placeholder
			description: APP_CONFIG.brand.description,
			lang: "pt-BR",
			start_url: "/",
			scope: "/",
			display: "standalone",
			background_color: "#0c0a09",
			theme_color: "#000000", // FIXME: placeholder
			icons: [
				// ? One square icon per size, used both as a plain and as a maskable icon (its margin is inside the maskable safe zone).
				{ src: "/images/pwa/maskable-icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
				{ src: "/images/pwa/maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
			],
		},
		workbox: {
			globPatterns: [],
			// ? Navigations are never answered by the worker (the plugin would otherwise fall back to a precached index.html): the pages, the
			// ? static pages of the build and the share addresses (the web server) always come from the network.
			navigateFallback: null,
			cleanupOutdatedCaches: true,
			clientsClaim: true,
			skipWaiting: true,
			runtimeCaching: [
				{
					urlPattern: ({ url }) => url.origin === self.location.origin && url.pathname.startsWith("/assets/"),
					handler: "CacheFirst",
					options: {
						cacheName: "build-assets",
						expiration: { maxEntries: 150, maxAgeSeconds: 30 * 24 * 60 * 60 },
					},
				},
				// ? The static files of `public/` (no hash in the name, so a file can change under the same address): stale-while-revalidate
				// ? serves the copy at once, even offline, and refreshes it for the next visit. The media of the posts (the feed, from the CDN)
				// ? is not cached on purpose: each post is seen once, it would only fill the storage.
				{
					urlPattern: ({ url }) => url.origin === self.location.origin && /^\/(images|videos|meta)\//.test(url.pathname),
					handler: "StaleWhileRevalidate",
					options: {
						cacheName: "public-files",
						expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60, purgeOnQuotaError: true },
						cacheableResponse: { statuses: [200] },
					},
				},
			],
		},
	});

	// NOTE: Nitro builds a second environment with the same output, so the PWA would run twice; the client one is enough
	for (const plugin of plugins) {
		plugin.applyToEnvironment = (environment) => environment.name === "client";
	}

	return plugins;
}
