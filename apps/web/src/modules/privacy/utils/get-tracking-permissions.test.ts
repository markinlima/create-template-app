import { describe, expect, it } from "bun:test";

import { DEFAULT_PRIVACY_CHOICES } from "@/modules/privacy/stores/privacy-store";
import { getTrackingPermissions } from "@/modules/privacy/utils/get-tracking-permissions";

describe("getTrackingPermissions", () => {
	it("tracks nothing while the visitor has made no choice (opt-in)", () => {
		expect(getTrackingPermissions(DEFAULT_PRIVACY_CHOICES)).toEqual({ metrics: false, identify: false, recording: false });
	});

	it("allows anonymous metrics alone, without the id or the recording", () => {
		expect(getTrackingPermissions({ anonymousMetrics: true, improveWithMyData: false })).toEqual({
			metrics: true,
			identify: false,
			recording: false,
		});
	});

	it("allows the id and the recording only with the tracking by id, which also allows the metrics", () => {
		expect(getTrackingPermissions({ anonymousMetrics: false, improveWithMyData: true })).toEqual({
			metrics: true,
			identify: true,
			recording: true,
		});
	});

	it("ignores every choice when the browser asks not to be tracked", () => {
		expect(getTrackingPermissions({ anonymousMetrics: false, improveWithMyData: true }, { privacySignal: true })).toEqual({
			metrics: false,
			identify: false,
			recording: false,
		});
	});
});
