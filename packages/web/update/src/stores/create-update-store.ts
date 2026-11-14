import type { z } from "zod";
import { createStore } from "zustand/vanilla";

import { DEFAULT_FILE_NAME } from "../constants/update-file";
import { DEFAULT_INTERVAL_MS } from "../constants/update-interval";
import { browserEvents } from "../lib/browser-events";
import {
  type UpdateFileData,
  updateFileSchema,
} from "../schemas/update-file-schema";
import type { CreateUpdateStoreOptions } from "../types/create-update-store-options";
import type { UpdateState } from "../types/update-state";
import { fetchUpdateFile } from "../utils/fetch-update-file";
import { normalizeFileName } from "../utils/normalize-file-name";

/**
 * The update state (a Zustand store, shared by every hook of one checker) and what keeps it fresh. `watch` starts the timer and the listeners
 * and gives back what stops them; it counts the callers, so everything runs only while something is watching and a checker nobody reads
 * costs nothing.
 *
 * @param options - See {@link CreateUpdateStoreOptions}.
 * @returns The store, `check` and `watch`.
 */
export function createUpdateStore<
  TSchema extends z.ZodType<UpdateFileData> = typeof updateFileSchema,
>({
  currentBuildId,
  fileName = DEFAULT_FILE_NAME,
  intervalMs = DEFAULT_INTERVAL_MS,
  schema = updateFileSchema as unknown as TSchema,
  treatPreloadErrorAsUpdate = true,
  fetcher,
  events = browserEvents,
}: CreateUpdateStoreOptions<TSchema>) {
  const url = `/${normalizeFileName(fileName)}`;

  const store = createStore<UpdateState<z.infer<TSchema>>>(() => ({
    hasNewUpdate: false,
    data: null,
  }));

  let watchers = 0;
  let stopWatching: (() => void) | undefined;

  async function check() {
    const data = await fetchUpdateFile({ url, schema, fetcher });

    if (data === null) {
      return;
    }

    store.setState((state) => ({
      hasNewUpdate: state.hasNewUpdate || data.buildId !== currentBuildId,
      data,
    }));
  }

  function start() {
    const interval = setInterval(() => void check(), intervalMs);
    const stopVisible = events.onTabVisible(() => void check());
    const stopPreload = treatPreloadErrorAsUpdate
      ? events.onPreloadError(() => store.setState({ hasNewUpdate: true }))
      : () => {};

    stopWatching = () => {
      clearInterval(interval);
      stopVisible();
      stopPreload();
    };
  }

  function watch() {
    watchers++;

    if (watchers === 1) {
      start();
    }

    return () => {
      watchers--;

      if (watchers === 0) {
        stopWatching?.();
        stopWatching = undefined;
      }
    };
  }

  return { store, check, watch };
}
