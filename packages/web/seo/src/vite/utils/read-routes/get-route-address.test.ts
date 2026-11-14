import { describe, expect, it } from "bun:test";

import { getRouteAddress } from "./get-route-address";

describe("getRouteAddress", () => {
  it("drops the pathless groups and the trailing slash", () => {
    expect(getRouteAddress("/_landing-pages/about-us/")).toBe("/about-us");
    expect(getRouteAddress("/auth/_redirect/login/")).toBe("/auth/login");
    expect(getRouteAddress("/_landing-pages/policies/privacy-policy/")).toBe(
      "/policies/privacy-policy",
    );
  });

  it("gives the home for the root", () => {
    expect(getRouteAddress("/")).toBe("/");
  });

  it("refuses a route with a parameter, which has no single address", () => {
    expect(() => getRouteAddress("/post/$postId/")).toThrow("has a parameter");
  });
});
