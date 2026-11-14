import { describe, expect, it } from "bun:test";

import { buildUmamiScripts, getUmamiCollectUrl, isUmamiConfigured } from "@/lib/analytics/umami";

describe("umami", () => {
	it("is configured only with the address and the website id", () => {
		expect(isUmamiConfigured({ url: "https://umami.test", websiteId: "id" })).toBe(true);
		expect(isUmamiConfigured({ url: "https://umami.test" })).toBe(false);
		expect(isUmamiConfigured({ websiteId: "id" })).toBe(false);
		expect(isUmamiConfigured({})).toBe(false);
	});

	it("builds the tracker and the recorder with the website id", () => {
		const scripts = buildUmamiScripts({ url: "https://umami.test", websiteId: "id" });

		expect(scripts.map(({ src }) => src)).toEqual(["https://umami.test/script.js", "https://umami.test/recorder.js"]);
		expect(scripts.every((script) => script["data-website-id"] === "id")).toBe(true);
	});

	it("asks for the tracker script by the name the server gave it", () => {
		const [tracker] = buildUmamiScripts({ url: "https://umami.test", websiteId: "id", trackerScriptName: "other.js" });

		expect(tracker?.src).toBe("https://umami.test/other.js");
	});

	it("points the events to the endpoint the server gave it", () => {
		const config = { url: "https://umami.test", websiteId: "id" };

		expect(getUmamiCollectUrl({ ...config, collectApiEndpoint: "/api/custom" })).toBe("https://umami.test/api/custom");
		expect(getUmamiCollectUrl(config)).toBe("https://umami.test/api/send");
		expect(getUmamiCollectUrl({ url: "https://umami.test" })).toBeUndefined();
	});

	it("adds no script when it is not configured", () => {
		expect(buildUmamiScripts({ url: "https://umami.test" })).toEqual([]);
		expect(buildUmamiScripts({})).toEqual([]);
	});

	it("gives the recorder only the id of the website: its settings are in the Umami dashboard", () => {
		const [, recorder] = buildUmamiScripts({ url: "https://umami.test", websiteId: "id" });

		expect(recorder).toEqual({ src: "https://umami.test/recorder.js", "data-website-id": "id", defer: true });
	});
});
