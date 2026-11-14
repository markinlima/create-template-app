import {
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";

import { detectAdblock } from "./detect-adblock";
import * as baitModule from "./utils/is-bait-hidden";
import * as requestModule from "./utils/is-request-blocked";
import * as scriptModule from "./utils/is-script-blocked";

const isBaitHidden = spyOn(baitModule, "isBaitHidden");
const isRequestBlocked = spyOn(requestModule, "isRequestBlocked");
const isScriptBlocked = spyOn(scriptModule, "isScriptBlocked");

afterAll(() => {
  mock.restore();
});

const never = new Promise<boolean>(() => undefined);

beforeEach(() => {
  isBaitHidden.mockClear();
  isRequestBlocked.mockClear();
  isScriptBlocked.mockClear();
  isBaitHidden.mockResolvedValue(false);
  isRequestBlocked.mockResolvedValue(false);
  isScriptBlocked.mockResolvedValue(false);
});

describe("detectAdblock", () => {
  it("is false when no probe finds a blocker", async () => {
    expect(
      await detectAdblock({ requests: [{ url: "https://errors.test/1" }] }),
    ).toBe(false);
  });

  it("answers true as soon as one probe does, without waiting for the others", async () => {
    isRequestBlocked.mockResolvedValue(true);
    isBaitHidden.mockReturnValue(never);
    isScriptBlocked.mockReturnValue(never);

    expect(
      await detectAdblock({ requests: [{ url: "https://errors.test/1" }] }),
    ).toBe(true);
  });

  it("counts a blocked script", async () => {
    isScriptBlocked.mockImplementation(async (src) =>
      src.startsWith("/ads/ads.js"),
    );

    expect(await detectAdblock()).toBe(true);
  });

  it("skips the baits that are turned off", async () => {
    await detectAdblock({ ownBaitUrl: null, thirdPartyBaitUrl: null });

    expect(isScriptBlocked).not.toHaveBeenCalled();
  });
});
