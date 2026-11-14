import path from "node:path";

import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { analyzer } from "vite-bundle-analyzer";

import { buildEnvSchema, serverEnvSchema } from "@shared/env/web";
import { adblockBait } from "@web/detect-adblock/vite";
import { seoPrerender } from "@web/seo/vite";
import { webServer } from "@web/server/vite";
import { createBuildId, updateChecker } from "@web/update/vite";

import { seo } from "./src/lib/seo/seo.ts";
import { setupPwa } from "./src/lib/vite/setup-pwa.ts";
import { setupSentrySourcemap } from "./src/lib/vite/setup-sentry-sourcemap.ts";
import { shouldRemoveDevtools } from "./src/lib/vite/should-remove-devtools.ts";

const OUT_DIR = "dist";
const CLIENT_OUT_DIR = path.join(OUT_DIR, "client");
const DEV_CLIENT_OUT_DIR = path.join("node_modules", ".cache", "web-dev", "client");

const ARTIFACTS_DIR = "build";

export default defineConfig(({ command, mode }) => {
	// NOTE: one id per Vite run: the update checker writes it in the build and the code reads the same one from the env
	const buildId = createBuildId();
	const env = { ...loadEnv(mode, process.cwd(), ""), VITE_BUILD_ID: buildId };

	const parsedEnv = buildEnvSchema.parse(env);
	const { VITE_FRONTEND_URL: siteUrl, ANALYZE_BUNDLE: shouldAnalyzeBundle, COMPRESS_BUNDLE: shouldCompressBundle } = parsedEnv;

	const publicEnv = serverEnvSchema.parse(env);

	const sentrySourcemap = setupSentrySourcemap({ mode, env });
	const clientOutDir = command === "serve" ? DEV_CLIENT_OUT_DIR : CLIENT_OUT_DIR;

	const plugins = [
		devtools({
			removeDevtoolsOnBuild: shouldRemoveDevtools(env),
		}),
		tanstackRouter({
			autoCodeSplitting: true,
			routesDirectory: "./src/routes",
			generatedRouteTree: "./src/types/routeTree.generated.ts",
			routeFileIgnorePrefix: "-",
			quoteStyle: "double",
			target: "react",
		}),
		tailwindcss(),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
		updateChecker({ buildId }),
		adblockBait(),
		setupPwa(),
		seoPrerender({ seo, siteUrl }),
		...sentrySourcemap.plugins,
		...webServer({
			env: publicEnv,
			nitro: {
				serverDir: "./server",
				compressPublicAssets: shouldCompressBundle && { gzip: true, brotli: true },
				// NOTE: the build has no renderer (the web server serves it); `vite dev` has no build, so Nitro answers the app addresses with `index.html`
				renderer: command === "serve" ? { template: "./index.html" } : undefined,
				output: { dir: OUT_DIR, publicDir: clientOutDir },
			},
		}),
		analyzer({
			analyzerMode: "static",
			fileName: (outputDir) => path.relative(outputDir, path.resolve(ARTIFACTS_DIR, "bundle-analysis.html")),
			enabled: shouldAnalyzeBundle,
		}),
	];

	return {
		plugins,
		environments: {
			client: { build: { rollupOptions: { input: "index.html" } } },
		},
		build: {
			outDir: clientOutDir,
			sourcemap: sentrySourcemap.enabled,
		},
		resolve: {
			tsconfigPaths: true,
		},
		server: {
			host: true,
			open: false,
			port: 5173,
		},
	};
});
