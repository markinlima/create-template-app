import { describe, expect, it } from "bun:test";

import { z } from "zod";

import { updateFileSchema } from "../schemas/update-file-schema";
import type { UpdateEvents } from "../types/update-events";
import { createUpdateStore } from "./create-update-store";

function publish(body: unknown) {
  return (async () =>
    new Response(JSON.stringify(body))) as unknown as typeof fetch;
}

function createFakeEvents() {
  const visible = new Set<() => void>();
  const preloadError = new Set<() => void>();
  const events: UpdateEvents = {
    onTabVisible(callback) {
      visible.add(callback);
      return () => visible.delete(callback);
    },
    onPreloadError(callback) {
      preloadError.add(callback);
      return () => preloadError.delete(callback);
    },
  };

  return { events, visible, preloadError };
}

describe("createUpdateStore", () => {
  it("tells there is an update when the published build is not the one running", async () => {
    const update = createUpdateStore({
      currentBuildId: "1",
      fetcher: publish({ buildId: "2", notes: "new" }),
      events: createFakeEvents().events,
    });

    await update.check();

    expect(update.store.getState() as unknown).toEqual({
      hasNewUpdate: true,
      data: { buildId: "2", notes: "new" },
    });
  });

  it("tells nothing when the published build is the one running, and keeps its data", async () => {
    const update = createUpdateStore({
      currentBuildId: "1",
      fetcher: publish({ buildId: "1" }),
      events: createFakeEvents().events,
    });

    await update.check();

    expect(update.store.getState()).toEqual({
      hasNewUpdate: false,
      data: { buildId: "1" },
    });
  });

  it("keeps the notice once it was told, even if a later check sees the same build again", async () => {
    let buildId = "2";
    const update = createUpdateStore({
      currentBuildId: "1",
      fetcher: (async () =>
        new Response(JSON.stringify({ buildId }))) as unknown as typeof fetch,
      events: createFakeEvents().events,
    });

    await update.check();
    buildId = "1";
    await update.check();

    expect(update.store.getState().hasNewUpdate).toBe(true);
  });

  it("changes nothing when the file can't be read", async () => {
    const update = createUpdateStore({
      currentBuildId: "1",
      fetcher: (async () =>
        new Response("", { status: 500 })) as unknown as typeof fetch,
      events: createFakeEvents().events,
    });

    await update.check();

    expect(update.store.getState()).toEqual({
      hasNewUpdate: false,
      data: null,
    });
  });

  it("asks for the file by its name, at the root of the site", async () => {
    let asked = "";
    const update = createUpdateStore({
      currentBuildId: "1",
      fileName: "build.json",
      fetcher: (async (url: unknown) => {
        asked = String(url);
        return new Response("{}");
      }) as unknown as typeof fetch,
      events: createFakeEvents().events,
    });

    await update.check();

    expect(asked).toBe("/build.json");
  });

  it("uses the schema of the app", async () => {
    const update = createUpdateStore({
      currentBuildId: "1",
      schema: updateFileSchema.extend({ notes: z.string() }),
      fetcher: publish({ buildId: "9", notes: "n" }),
      events: createFakeEvents().events,
    });

    await update.check();

    expect(update.store.getState().data).toEqual({ buildId: "9", notes: "n" });
  });

  it("listens only while something is watching", () => {
    const fake = createFakeEvents();
    const update = createUpdateStore({
      currentBuildId: "1",
      events: fake.events,
    });

    expect(fake.visible.size).toBe(0);

    const stopFirst = update.watch();
    const stopSecond = update.watch();

    expect(fake.visible.size).toBe(1);
    expect(fake.preloadError.size).toBe(1);

    stopFirst();
    expect(fake.visible.size).toBe(1);

    stopSecond();
    expect(fake.visible.size).toBe(0);
    expect(fake.preloadError.size).toBe(0);
  });

  it("takes a chunk that fails to load as an update, and notifies the subscribers", () => {
    const fake = createFakeEvents();
    const update = createUpdateStore({
      currentBuildId: "1",
      events: fake.events,
    });
    let notified = 0;

    update.store.subscribe(() => {
      notified++;
    });
    const stop = update.watch();
    for (const callback of fake.preloadError) {
      callback();
    }
    stop();

    expect(update.store.getState().hasNewUpdate).toBe(true);
    expect(notified).toBe(1);
  });

  it("can ignore a chunk that fails to load", () => {
    const fake = createFakeEvents();
    const update = createUpdateStore({
      currentBuildId: "1",
      treatPreloadErrorAsUpdate: false,
      events: fake.events,
    });

    const stop = update.watch();

    expect(fake.preloadError.size).toBe(0);

    stop();
  });
});
