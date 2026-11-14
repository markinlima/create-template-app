import { use } from "react";

import { InfiniteListScrollContext } from "../context/infinite-list-scroll-context";

/**
 * Read the scroll container shared by an `<InfiniteListScroll>`.
 *
 * @returns The scroll element, the header size and the restoration id.
 * @throws When used outside an `<InfiniteListScroll>`.
 */
export function useInfiniteListScrollContext() {
  const context = use(InfiniteListScrollContext);

  if (!context) {
    throw new Error(
      "useInfiniteListScrollContext must be used within an <InfiniteListScroll>",
    );
  }

  return context;
}
