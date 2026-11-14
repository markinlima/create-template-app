import { InfiniteListScrollHeader } from "./components/infinite-list-scroll-header";
import { InfiniteListScrollRoot } from "./components/infinite-list-scroll-root";
import { InfiniteListScrollToTop } from "./components/infinite-list-scroll-to-top";

export type { InfiniteListScrollContextProps } from "./context/infinite-list-scroll-context";
export { useInfiniteListScrollContext } from "./hooks/use-infinite-list-scroll-context";

/** The scrolling container the lists live in, with its `header` and `scrollToTop` parts. */
export const InfiniteListScroll = Object.assign(InfiniteListScrollRoot, {
  header: InfiniteListScrollHeader,
  scrollToTop: InfiniteListScrollToTop,
});
