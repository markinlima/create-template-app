import { describe, expect, it } from "bun:test";

import { buildDeployRequest } from "./build-deploy-request";

describe("buildDeployRequest", () => {
  it("should post the compose id with the API key", async () => {
    const request = buildDeployRequest({
      url: "https://dokploy.example.com/",
      token: "secret",
      composeId: "abc",
    });

    expect(request.method).toBe("POST");
    expect(request.url).toBe("https://dokploy.example.com/api/compose.deploy");
    expect(request.headers.get("x-api-key")).toBe("secret");
    expect(await request.json()).toEqual({ composeId: "abc" });
  });
});
