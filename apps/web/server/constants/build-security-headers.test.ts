import { describe, expect, it } from "bun:test";

import { buildSecurityHeaders } from "./build-security-headers";

describe("buildSecurityHeaders", () => {
	it("sends the fixed headers", () => {
		const headers = buildSecurityHeaders();

		expect(headers["Strict-Transport-Security"]).toBe("max-age=31536000");
		expect(headers["X-Content-Type-Options"]).toBe("nosniff");
		expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
		expect(headers["Permissions-Policy"]).toBe("camera=(self), microphone=(self), geolocation=(), payment=(), usb=()");
	});

	it("allows only itself to frame the app when Umami is not configured", () => {
		expect(buildSecurityHeaders()["Content-Security-Policy"]).toBe("frame-ancestors 'self'");
		expect(buildSecurityHeaders({ umamiUrl: "" })["Content-Security-Policy"]).toBe("frame-ancestors 'self'");
	});

	it("also allows the origin of Umami", () => {
		expect(buildSecurityHeaders({ umamiUrl: "https://analytics.example.com/path" })["Content-Security-Policy"]).toBe(
			"frame-ancestors 'self' https://analytics.example.com",
		);
	});
});
