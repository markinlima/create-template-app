import type { ReactNode } from "react";

/** What every list needs to know about the data it shows. */
export interface InfiniteListData<T> {
  /** Items to render. Can be `undefined` while the first page is loading. */
  data: T[] | undefined;
  /** The first page is still loading: the list shows `renderInitialLoader` instead of items. */
  isLoadingInitialData: boolean;
  /** The next page is being fetched. */
  isFetchingNextPage: boolean;
  /** There is another page after the loaded ones. */
  isNextPageAvailable: boolean;
  /**
   * Fetching the next page failed. The list stops loading by itself and shows `renderNextPageError`
   * until `retry` is called.
   */
  isNextPageError?: boolean;
  /** Called when the end of the list gets close. Start fetching the next page here. */
  onScrollNearEnd?: () => Promise<unknown> | unknown;
  /** Stable key of an item. Falls back to the index. */
  getItemKey?: (item: T, index: number) => string | number | undefined;
}

export interface RenderItemProps<T> {
  item: T;
  index: number;
}

/**
 * Slots (`renderItem`, `renderEmpty`...) are rendered as components of their own, so they can
 * use hooks and passing an inline arrow function doesn't remount the rows on every render.
 */
export interface InfiniteListSlots<T> {
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
