import { describe, expect, it } from "bun:test";

import { getCacheControl } from "./get-cache-control";

const options = {
  rules: [
    { match: "/assets/", cacheControl: "immutable" },
    { match: /^\/(images|videos)\//, cacheControl: "one day" },
    { match: /^\/sw\.js$/, cacheControl: "no-cache" },
  ],
  defaultCacheControl: "five minutes",
};

describe("getCacheControl", () => {
  it("uses the rule whose start matches the address when the match is a string", () => {
    expect(getCacheControl("/assets/index-Cp-GBc3c.js", options)).toBe(
      "immutable",
    );
  });

  it("uses the rule whose expression matches the address", () => {
    expect(getCacheControl("/images/logos/a.webp", options)).toBe("one day");
    expect(getCacheControl("/videos/clip.mp4", options)).toBe("one day");
    expect(getCacheControl("/sw.js", options)).toBe("no-cache");
  });

  it("uses the first rule that matches", () => {
    const rules = [
      { match: "/assets/", cacheControl: "first" },
      { match: "/assets/", cacheControl: "second" },
    ];

    expect(
      getCacheControl("/assets/a.js", { rules, defaultCacheControl: "d" }),
    ).toBe("first");
  });

  it("uses the default for anything else", () => {
    for (const pathname of ["/", "/index.html", "/about-us", "/version.json"]) {
      expect(getCacheControl(pathname, options)).toBe("five minutes");
    }
  });

  it("does not take a folder that only starts with the same letters", () => {
    expect(getCacheControl("/images-old/a.png", options)).toBe("five minutes");
    expect(getCacheControl("/assetsfoo", options)).toBe("five minutes");
    expect(getCacheControl("/sw.js.map", options)).toBe("five minutes");
  });
});
