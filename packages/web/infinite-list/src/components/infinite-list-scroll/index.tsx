import { InfiniteListScrollHeader } from "./infinite-list-scroll-header";
import { InfiniteListScrollRoot } from "./infinite-list-scroll-root";
import { InfiniteListScrollToTop } from "./infinite-list-scroll-to-top";

export const InfiniteListScroll = Object.assign(InfiniteListScrollRoot, {
  header: InfiniteListScrollHeader,
  scrollToTop: InfiniteListScrollToTop,
});
