import { describe, expect, it } from "vitest";

import { getErrorRedirectUrl } from "@/lib/tanstack-query/get-error-redirect-url";

describe("getErrorRedirectUrl", () => {
	it("sends the user to the server error page, which sends them back to where they were", () => {
		expect(getErrorRedirectUrl({ status: 502, currentPath: "/app/list?a=1" })).toBe("/error/server-error?redirect=%2Fapp%2Flist%3Fa%3D1");
		expect(getErrorRedirectUrl({ axiosCode: "ERR_NETWORK", currentPath: "/app" })).toContain("/error/server-error");
	});

	it("doesn't reload the server error page while on it", () => {
		expect(getErrorRedirectUrl({ status: 502, currentPath: "/error/server-error?redirect=%2Fapp" })).toBeNull();
	});

	it("sends a session that ended inside the app to the login, and back after it", () => {
		expect(getErrorRedirectUrl({ status: 401, currentPath: "/app/profile", requestUrl: "/items" })).toBe(
			"/auth/login?redirect=%2Fapp%2Fprofile",
		);
	});

	it("leaves a 401 of the login, and any 401 outside the app, alone", () => {
		expect(getErrorRedirectUrl({ status: 401, currentPath: "/app", requestUrl: "/auth/sign-in" })).toBeNull();
		expect(getErrorRedirectUrl({ status: 401, currentPath: "/auth/login", requestUrl: "/items" })).toBeNull();
	});

	it("is for the screen to show everything else", () => {
		expect(getErrorRedirectUrl({ status: 404, currentPath: "/app" })).toBeNull();
		expect(getErrorRedirectUrl({ status: 500, currentPath: "/app" })).toBeNull();
	});
});
