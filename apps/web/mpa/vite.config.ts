import babel from "@rolldown/plugin-babel";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	const plugins = [
		devtools({
			removeDevtoolsOnBuild: true,
		}),
		tanstackStart({
			router: { generatedRouteTree: "./types/routeTree.generated.ts", quoteStyle: "double" },
		}),
		nitro({ output: { dir: "./build/frontend" }, preset: "bun" }),
		tailwindcss(),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
		sentryVitePlugin({
			url: env.VITE_SENTRY_URL,
			authToken: env.SENTRY_AUTH_TOKEN,
			org: env.VITE_SENTRY_ORG,
			project: env.VITE_SENTRY_PROJECT,
			telemetry: false,
			sourcemaps: {
				// As you're enabling client source maps, you probably want to delete them after they're uploaded to Sentry.
				// Set the appropriate glob pattern for your output folder - some glob examples below:
				filesToDeleteAfterUpload: ["./**/*.map", ".*/**/public/**/*.map", "./dist/**/client/**/*.map"],
			},
		}),
	];

	return {
		plugins,
		build: {
			sourcemap: true,
			outDir: "./build/frontend",
			reportCompressedSize: true,
		},
		resolve: {
			tsconfigPaths: true,
		},
		optimizeDeps: {
			// ? ffmpeg.wasm starts its own worker from inside the package, which Vite's dependency pre-bundling breaks.
			exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
		},
		server: {
			host: true,
			open: false,
			port: 5173,
		},
	};
});
