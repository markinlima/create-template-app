import { createContext, type RefObject } from "react";

/** What the `InfiniteListScroll` container shares with the list, the header and the scroll to top button. */
export interface InfiniteListScrollContextProps {
  /** Same element as `scrollElement`, as a ref. */
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  /** The scrolling element. `null` until it mounts, and it triggers a render when it does. */
  scrollElement: HTMLDivElement | null;
  /** Ref of the header element, whose height is measured. */
  scrollContainerHeaderRef: RefObject<HTMLDivElement | null>;
  /** Identifies the container for scroll restoration (`data-scroll-restoration-id`). */
  scrollRestorationId?: string;
  /** Height of the header, plus `additionalHeaderHeight`. The list starts below it. */
  headerHeight: number;
}

/** Context of the scroll container; read it through {@link useInfiniteListScrollContext}. */
export const InfiniteListScrollContext =
  createContext<InfiniteListScrollContextProps | null>(null);
