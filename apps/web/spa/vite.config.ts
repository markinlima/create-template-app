import babel from "@rolldown/plugin-babel";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	const plugins = [
		devtools({
			removeDevtoolsOnBuild: true,
		}),
		// ? Must come before the React plugin. It reads `tsr.config.json` (routes folder, generated route tree...).
		tanstackRouter({ target: "react", autoCodeSplitting: true }),
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
				filesToDeleteAfterUpload: ["./**/*.map", "./dist/**/*.map"],
			},
		}),
	];

	return {
		plugins,
		build: {
			sourcemap: true,
			outDir: "./dist",
			reportCompressedSize: true,
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
