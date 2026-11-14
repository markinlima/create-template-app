import { useEffect } from "react";
import type { z } from "zod";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import type {
  UpdateFileData,
  updateFileSchema,
} from "./schemas/update-file-schema";
import { createUpdateStore } from "./stores/create-update-store";
import type { CreateUpdateStoreOptions } from "./types/create-update-store-options";

/**
 * The update check of the app: tells a tab that a build other than the one it is running was published. The build writes a small file with
 * its id (the Vite plugin of `@web/update/vite`), the tab asks for it every few minutes and when it comes back to the front, and a different
 * id is an update. Nothing is saved in the browser: the build the tab runs is the id the code was made with.
 *
 * Call it once, in a file of its own, and use its hooks anywhere; they share one store and one timer. There is no provider.
 *
 * @param options - See {@link UpdateCheckerOptions}, without the `fetcher` and `events` of the tests.
 * @returns The hooks `useHasNewUpdate`, `useUpdateData` and `useUpdateState`, and `check` to ask for the file at once.
 */
export function createUpdateChecker<
  TSchema extends z.ZodType<UpdateFileData> = typeof updateFileSchema,
>(options: Omit<CreateUpdateStoreOptions<TSchema>, "fetcher" | "events">) {
  const { store, check, watch } = createUpdateStore<TSchema>(options);

  /** Whether a build other than the one running was published. The check runs while a component reads it. */
  function useHasNewUpdate() {
    useEffect(watch, []);

    return useStore(store, (state) => state.hasNewUpdate);
  }

  /** The content of the update file as published at the last check (`null` before it), for what the app needs to do with it. */
  function useUpdateData() {
    useEffect(watch, []);

    return useStore(store, (state) => state.data);
  }

  /**
   * Both values at once. The selector returns a new object each time, so `useShallow` compares its fields: the component renders when one
   * of them changes, not on every store update.
   */
  function useUpdateState() {
    useEffect(watch, []);

    return useStore(
      store,
      useShallow((state) => ({
        hasNewUpdate: state.hasNewUpdate,
        data: state.data,
      })),
    );
  }

  return { useHasNewUpdate, useUpdateData, useUpdateState, check };
}
