import { createContext, type RefObject, use } from "react";

export interface InfiniteListScrollContextProps {
  /** Same element as `scrollElement`, as a ref. */
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  /** The scrolling element. `null` until it mounts, and it triggers a render when it does. */
  scrollElement: HTMLDivElement | null;
  scrollContainerHeaderRef: RefObject<HTMLDivElement | null>;
  scrollRestorationId?: string;
  /** Height of the header, plus `additionalHeaderHeight`. The list starts below it. */
  headerHeight: number;
}

export const InfiniteListScrollContext =
  createContext<InfiniteListScrollContextProps | null>(null);

export function useInfiniteListScrollContext() {
  const context = use(InfiniteListScrollContext);

  if (!context) {
    throw new Error(
      "useInfiniteListScrollContext must be used within an <InfiniteListScroll>",
    );
  }

  return context;
}
