import { readdirSync } from "node:fs";
import path from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "bun:test";

// NOTE: builds the app, starts `dist/server/index.mjs` and asks it, so the files, cache rules, security headers and health check of the image are checked without a container

const APP_ROOT = path.resolve(import.meta.dir, "../..");
const DIST = path.join(APP_ROOT, "dist");
const CLIENT = path.join(DIST, "client");
const UMAMI_URL = "https://umami.example.test";
const START_TIMEOUT_MS = 20_000;

async function getFreePort() {
	const probe = Bun.serve({ port: 0, fetch: () => new Response() });
	const { port } = probe;

	await probe.stop(true);

	return port as number;
}

async function waitForHealth(port: number) {
	const deadline = Date.now() + START_TIMEOUT_MS;

	while (Date.now() < deadline) {
		try {
			if ((await fetch(`http://127.0.0.1:${port}/healthz`)).ok) {
				return;
			}
		} catch {
			// NOTE: not listening yet
		}

		await Bun.sleep(250);
	}

	throw new Error(`The server did not answer /healthz in ${START_TIMEOUT_MS / 1000}s`);
}

let server: ReturnType<typeof Bun.spawn>;
let port = 0;

function get(pathname: string, init?: RequestInit) {
	return fetch(`http://127.0.0.1:${port}${pathname}`, init);
}

beforeAll(async () => {
	const build = Bun.spawn(["bun", "run", "build"], {
		cwd: APP_ROOT,
		// NOTE: a production bundle (`NODE_ENV=test` keeps the development branches of the libraries), without the compressed copies, which are most of the build time
		env: {
			...process.env,
			NODE_ENV: "production",
			VITE_API_URL: "https://api.example.test",
			VITE_USER_NODE_ENV: "test",
			COMPRESS_BUNDLE: "false",
		},
		stdout: "pipe",
		stderr: "pipe",
	});
	const [code, output] = await Promise.all([build.exited, new Response(build.stdout).text()]);

	if (code !== 0) {
		throw new Error(`The build failed (${code}):\n${output}\n${await new Response(build.stderr).text()}`);
	}

	port = await getFreePort();
	server = Bun.spawn(["bun", "dist/server/index.mjs"], {
		cwd: APP_ROOT,
		env: { ...process.env, NODE_ENV: "production", PORT: String(port), VITE_UMAMI_URL: UMAMI_URL },
		stdout: "ignore",
		stderr: "ignore",
	});

	await waitForHealth(port);
}, 300_000);

afterAll(() => {
	server?.kill();
});

describe("the built server", () => {
	it("answers /healthz without caching it", async () => {
		const response = await get("/healthz");

		expect(response.status).toBe(200);
		expect(await response.text()).toBe("ok");
		expect(response.headers.get("cache-control")).toBe("no-store");
	});

	it("serves the shell with the tags of the site, kept for five minutes, and answers 304 to its ETag", async () => {
		const response = await get("/");
		const html = await response.text();

		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("text/html");
		expect(response.headers.get("cache-control")).toBe("public, max-age=300");
		expect(html).toContain("<title data-seo-tag>");

		const etag = response.headers.get("etag");

		expect(etag).toBeTruthy();
		expect((await get("/", { headers: { "If-None-Match": etag as string } })).status).toBe(304);
	});

	it("sends the security headers, letting only Umami frame the app", async () => {
		const response = await get("/");

		expect(response.headers.get("x-content-type-options")).toBe("nosniff");
		expect(response.headers.get("strict-transport-security")).toContain("max-age=");
		expect(response.headers.get("content-security-policy")).toBe(`frame-ancestors 'self' ${UMAMI_URL}`);
	});

	it("gives the shell to an address of the app (the router draws the page)", async () => {
		const shell = await (await get("/")).text();
		const response = await get("/app/some/page");

		expect(response.status).toBe(200);
		expect(await response.text()).toBe(shell);
	});

	it("serves the sitemap", async () => {
		const response = await get("/sitemap.xml");

		expect(response.status).toBe(200);
		expect(await response.text()).toContain("<urlset");
	});

	it("keeps a file with a hash in its name for a year, and answers 404, not cached for a year, to one that does not exist", async () => {
		const file = readdirSync(path.join(CLIENT, "assets")).find((name) => name.endsWith(".js"));
		const found = await get(`/assets/${file}`);

		expect(found.status).toBe(200);
		expect(found.headers.get("content-type")).toContain("javascript");
		expect(found.headers.get("cache-control")).toBe("public, max-age=31536000, immutable");

		const missing = await get("/assets/does-not-exist-abc123.js");

		expect(missing.status).toBe(404);
		expect(missing.headers.get("cache-control") ?? "").not.toContain("immutable");
	});

	it("serves the ads bait file that the ad blocker detection asks for", async () => {
		const response = await get("/ads/ads.js");

		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("javascript");
	});

	it("always asks for the files that tell the app a new build exists", async () => {
		for (const file of ["/manifest.webmanifest", "/version.json", "/sw.js"]) {
			const response = await get(file);

			expect(response.status).toBe(200);
			expect(response.headers.get("cache-control")).toBe("no-cache");
		}
	});

	it("refuses a method that does not read", async () => {
		expect((await get("/", { method: "POST" })).status).toBe(405);
	});
});

describe("the health check of the image", () => {
	async function runHealthCheck(healthPort: number) {
		const check = Bun.spawn(["bun", "dist/health-check.ts"], {
			cwd: APP_ROOT,
			env: { ...process.env, PORT: String(healthPort) },
			stdout: "ignore",
			stderr: "ignore",
		});

		return await check.exited;
	}

	it("exits 0 when the server is up", async () => {
		expect(await runHealthCheck(port)).toBe(0);
	});

	it("exits 1 when nothing answers", async () => {
		expect(await runHealthCheck(await getFreePort())).toBe(1);
	});
});
