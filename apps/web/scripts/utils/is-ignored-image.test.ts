import { describe, expect, test as it } from "bun:test";

import { isIgnoredImage } from "./is-ignored-image";

const ignore = { extensions: [".GIF"], folders: ["pwa"] };

describe("isIgnoredImage", () => {
	it("ignores an image inside an ignored folder, at any depth", () => {
		expect(isIgnoredImage("public/images/pwa/maskable-icon-192x192.png", ignore)).toBe(true);
		expect(isIgnoredImage("public/images/pwa/deep/icon.png", ignore)).toBe(true);
	});

	it("ignores the folder whatever the case or the separator", () => {
		expect(isIgnoredImage("public/images/PWA/icon.png", ignore)).toBe(true);
		expect(isIgnoredImage("public\\images\\pwa\\icon.png", ignore)).toBe(true);
	});

	it("does not ignore a folder that only has the name inside its own", () => {
		expect(isIgnoredImage("public/images/pwa-old/icon.png", ignore)).toBe(false);
		expect(isIgnoredImage("public/images/logos/pwa.png", ignore)).toBe(false);
	});

	it("ignores an extension, whatever the case", () => {
		expect(isIgnoredImage("public/images/memes/funny.gif", ignore)).toBe(true);
		expect(isIgnoredImage("public/images/memes/FUNNY.GIF", ignore)).toBe(true);
	});

	it("does not ignore the others", () => {
		expect(isIgnoredImage("public/images/banners/1.jpg", ignore)).toBe(false);
		expect(isIgnoredImage("a.png", { extensions: [], folders: [] })).toBe(false);
	});
});
