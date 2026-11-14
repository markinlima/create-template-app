import { afterEach, describe, expect, it } from "bun:test";

import { stubGlobal, unstubAllGlobals } from "@shared/utils/test";

import { hasPrivacySignal } from "@/modules/privacy/utils/has-privacy-signal";

describe("hasPrivacySignal", () => {
	afterEach(() => {
		unstubAllGlobals();
	});

	it("is false on the server and for a browser that sends nothing", () => {
		stubGlobal("navigator", undefined);
		expect(hasPrivacySignal()).toBe(false);

		stubGlobal("navigator", {});
		expect(hasPrivacySignal()).toBe(false);
	});

	it("is true for Global Privacy Control and for Do Not Track", () => {
		stubGlobal("navigator", { globalPrivacyControl: true });
		expect(hasPrivacySignal()).toBe(true);

		stubGlobal("navigator", { doNotTrack: "1" });
		expect(hasPrivacySignal()).toBe(true);
	});

	it("is false when Do Not Track says no", () => {
		stubGlobal("navigator", { doNotTrack: "0" });
		expect(hasPrivacySignal()).toBe(false);
	});
});
