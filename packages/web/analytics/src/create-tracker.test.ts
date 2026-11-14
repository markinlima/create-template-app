import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
  mock,
  spyOn,
} from "bun:test";

import { stubGlobal, unstubAllGlobals } from "@shared/utils/test";

import { createTracker } from "./create-tracker";
import type { UmamiTracker } from "./types/umami-window";

type TestEvents = {
  share: { content: string; channel: string };
  "sign-in": undefined;
};

function setUmami(umami: UmamiTracker | undefined) {
  window.umami = umami;
}

describe("createTracker", () => {
  beforeEach(() => {
    stubGlobal("window", {});
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    unstubAllGlobals();
  });

  it("does nothing, and keeps no queue, when it is disabled", () => {
    const { track } = createTracker<TestEvents>({ enabled: false });

    track("sign-in");
    jest.advanceTimersByTime(1000);
    setUmami({ track: mock() } as unknown as UmamiTracker);
    track("sign-in");

    expect(window.umami?.track).not.toHaveBeenCalled();
  });

  it("calls umami.track with the name and the data", () => {
    const umami = { track: mock() };
    const { track } = createTracker<TestEvents>();

    setUmami(umami);
    track("share", { content: "post", channel: "whatsapp" });
    track("sign-in");

    expect(umami.track).toHaveBeenNthCalledWith(1, "share", {
      content: "post",
      channel: "whatsapp",
    });
    expect(umami.track).toHaveBeenNthCalledWith(2, "sign-in");
  });

  it("queues events until umami appears, then flushes them in order", () => {
    const umami = { track: mock() };
    const { track } = createTracker<TestEvents>();

    track("sign-in");
    track("share", { content: "collection", channel: "x" });

    expect(umami.track).not.toHaveBeenCalled();

    setUmami(umami);
    jest.advanceTimersByTime(250);

    expect(umami.track).toHaveBeenNthCalledWith(1, "sign-in");
    expect(umami.track).toHaveBeenNthCalledWith(2, "share", {
      content: "collection",
      channel: "x",
    });
  });

  it("drops the queued events when umami never loads", () => {
    const umami = { track: mock() };
    const { track } = createTracker<TestEvents>();

    track("sign-in");
    jest.advanceTimersByTime(10_000);

    setUmami(umami);
    jest.advanceTimersByTime(1_000);

    expect(umami.track).not.toHaveBeenCalled();
  });

  it("swallows errors thrown by umami.track", () => {
    const umami = {
      track: mock(() => {
        throw new Error("tracker failed");
      }),
    };
    const { track } = createTracker<TestEvents>();

    setUmami(umami);

    expect(() => track("sign-in")).not.toThrow();
  });

  it("logs the events with console.debug only while debug is on, asking a function every time", () => {
    const debug = spyOn(console, "debug").mockImplementation(() => undefined);
    let isOn = false;
    const { track } = createTracker<TestEvents>({ debug: () => isOn });

    setUmami({ track: mock() });
    track("sign-in");
    isOn = true;
    track("sign-in");

    expect(debug).toHaveBeenCalledTimes(1);
    debug.mockRestore();
  });

  it("asks a function of `enabled` on every event, so a choice made later counts", () => {
    const umami = { track: mock() } as unknown as UmamiTracker;
    let allowed = false;
    const { track } = createTracker<TestEvents>({ enabled: () => allowed });

    setUmami(umami);
    track("sign-in");
    allowed = true;
    track("sign-in");
    allowed = false;
    track("sign-in");

    expect(umami.track).toHaveBeenCalledTimes(1);
  });

  describe("identify", () => {
    it("ties the session to the id of the user when the tracker is loaded", () => {
      const identify = mock();
      const { identify: identifyUser } = createTracker<TestEvents>();

      setUmami({ track: mock(), identify });
      identifyUser("user-1");

      expect(identify).toHaveBeenCalledWith("user-1");
    });

    it("does nothing while events are off, without the script or on the server", () => {
      const identify = mock();
      const { identify: whenOff } = createTracker<TestEvents>({
        enabled: false,
      });
      const { identify: whenOn } = createTracker<TestEvents>();

      setUmami({ track: mock(), identify });
      whenOff("user-1");
      setUmami(undefined);

      expect(() => whenOn("user-1")).not.toThrow();
      expect(identify).not.toHaveBeenCalled();
    });
  });
});
