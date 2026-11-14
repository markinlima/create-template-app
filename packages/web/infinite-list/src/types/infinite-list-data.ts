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
