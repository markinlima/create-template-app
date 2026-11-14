import type { ReactNode } from "react";

/** What `renderItem` receives. */
export interface RenderItemProps<T> {
  /** The item to render. */
  item: T;
  /** Position of the item in the list. */
  index: number;
}

/**
 * Slots (`renderItem`, `renderEmpty`...) are rendered as components of their own, so they can
 * use hooks and passing an inline arrow function doesn't remount the rows on every render.
 */
export interface InfiniteListSlots<T> {
  /** Renders one item. */
  renderItem: (props: RenderItemProps<T>) => ReactNode;
  /** Shown when there are no items and no next page. */
  renderEmpty?: () => ReactNode;
  /** Shown at the end of the list, when every item was loaded. */
  renderFooter?: () => ReactNode;
  /** Shown at the end of the list while there is a next page to load. */
  renderNextPageLoader?: () => ReactNode;
  /** Shown at the end of the list when fetching the next page failed. Call `retry` to try again. */
  renderNextPageError?: (props: { retry: () => void }) => ReactNode;
}
