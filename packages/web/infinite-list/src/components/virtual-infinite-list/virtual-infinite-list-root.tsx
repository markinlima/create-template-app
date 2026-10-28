import { useVirtualizer } from "@tanstack/react-virtual";
import type { ReactNode } from "react";

import { useInfiniteListScrollContext } from "../../context";
import {
  type KeyboardNavigationKeys,
  useKeyboardNavigation,
} from "../../hooks/use-keyboard-navigation";
import { RenderSlot } from "../../render-slot";
import type { InfiniteListData, InfiniteListSlots } from "../../types";
import {
  DefaultEmpty,
  DefaultFooter,
  DefaultInitialLoader,
  DefaultNextPageError,
} from "../defaults";
import { InfiniteListLoader } from "../infinite-list-loader/infinite-list-loader";

export interface VirtualInfiniteListProps<T>
  extends InfiniteListData<T>,
    InfiniteListSlots<T> {
  /**
   * Estimated height (px) of the item at `index`. Used before the item is measured, and as its
   * real height when `enableElementMeasurement` is off.
   */
  estimatedItemHeight: (index: number) => number;
  /** Items rendered beyond the visible area. @default 4 */
  overscan?: number;
  /** Space (px) between items. @default 0 */
  gap?: number;
  /** Space (px) before the first item. @default 0 */
  paddingTop?: number;
  /**
   * Measures the real height of each item with a `ResizeObserver`. For items of variable height.
   * The end row (loader, footer, empty state) is always measured, whatever this is. @default false
   */
  enableElementMeasurement?: boolean;
  /** Scrolls item by item with the keyboard. @default false */
  enableKeyboardNavigation?: boolean;
  /** Keys of the keyboard navigation. @default { previous: "w", next: "s" } */
  keyboardNavigationKeys?: KeyboardNavigationKeys;
  /** Scroll offset (px) to start at, e.g. restored by the router. */
  initialScrollOffset?: number;
  /** Shown instead of the items while the first page loads. Receives the header height. */
  renderInitialLoader?: (props: { headerSize: number }) => ReactNode;
}

/**
 * Virtualized infinite list. Only the visible rows are in the DOM, so it stays fast with
 * thousands of items. Must be inside an `<InfiniteListScroll>`, which is what scrolls.
 */
export function VirtualInfiniteListRoot<T>({
  data,
  isNextPageAvailable,
  isLoadingInitialData,
  isFetchingNextPage,
  isNextPageError = false,
  estimatedItemHeight,
  gap = 0,
  paddingTop = 0,
  overscan = 4,
  onScrollNearEnd,
  getItemKey,
  enableElementMeasurement = false,
  enableKeyboardNavigation = false,
  keyboardNavigationKeys,
  initialScrollOffset = 0,
  renderItem,
  renderInitialLoader = DefaultInitialLoader,
  renderNextPageLoader,
  renderNextPageError = DefaultNextPageError,
  renderEmpty = DefaultEmpty,
  renderFooter = DefaultFooter,
}: VirtualInfiniteListProps<T>) {
  const { scrollElement, headerHeight } = useInfiniteListScrollContext();
  const items = data ?? [];
  const hasNextPageError =
    isNextPageAvailable && isNextPageError && !isFetchingNextPage;

  const virtualizer = useVirtualizer({
    count: items.length + 1, // ? +1 row for the end of the list: next page loader, footer or empty state
    getScrollElement: () => scrollElement,
    estimateSize: estimatedItemHeight,
    scrollMargin: headerHeight,
    paddingStart: paddingTop,
    initialOffset: initialScrollOffset,
    useAnimationFrameWithResizeObserver: enableElementMeasurement,
    overscan,
    gap,
    getItemKey: (index) => {
      const item = items[index];

      if (item === undefined) {
        return `end-${index}`;
      }

      return getItemKey?.(item, index) ?? index;
    },
  });

  useKeyboardNavigation({
    scrollToIndex: virtualizer.scrollToIndex,
    getVirtualItems: virtualizer.getVirtualItems,
    getScrollOffset: () => virtualizer.scrollOffset,
    enabled: enableKeyboardNavigation,
    keys: keyboardNavigationKeys,
  });

  if (isLoadingInitialData) {
    return (
      <RenderSlot
        render={renderInitialLoader}
        props={{ headerSize: headerHeight + gap }}
      />
    );
  }

  return (
    <ul
      aria-busy={isFetchingNextPage}
      style={{
        width: "100%",
        position: "relative",
        height: `${virtualizer.getTotalSize()}px`,
      }}
    >
      {virtualizer.getVirtualItems().map((virtualItem) => {
        const isEndRow = virtualItem.index >= items.length;
        const item = items[virtualItem.index];
        // ? The end row (loader, footer or empty state) changes with the state of the list, so a fixed
        // ? height can't fit all of them. It is always measured; the items only when asked to.
        const shouldMeasure = enableElementMeasurement || isEndRow;

        return (
          <li
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={shouldMeasure ? virtualizer.measureElement : undefined}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: shouldMeasure ? "auto" : `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {!isEndRow && item !== undefined && (
              <RenderSlot
                render={renderItem}
                props={{ item, index: virtualItem.index }}
              />
            )}
            {isEndRow && hasNextPageError && (
              <RenderSlot
                render={renderNextPageError}
                props={{ retry: () => onScrollNearEnd?.() }}
              />
            )}
            {isEndRow && isNextPageAvailable && !hasNextPageError && (
              <InfiniteListLoader
                onLoaderInView={onScrollNearEnd}
                disabled={isFetchingNextPage}
                loadedCount={items.length}
              >
                {renderNextPageLoader ? (
                  <RenderSlot render={renderNextPageLoader} props={undefined} />
                ) : null}
              </InfiniteListLoader>
            )}
            {isEndRow && !isNextPageAvailable && items.length > 0 && (
              <RenderSlot render={renderFooter} props={undefined} />
            )}
            {isEndRow && !isNextPageAvailable && items.length === 0 && (
              <RenderSlot render={renderEmpty} props={undefined} />
            )}
          </li>
        );
      })}
    </ul>
  );
}
