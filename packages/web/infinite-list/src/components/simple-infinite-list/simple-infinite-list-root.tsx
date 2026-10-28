import type { ReactNode } from "react";
import { cn } from "tailwind-variants";

import { RenderSlot } from "../../render-slot";
import type { InfiniteListData, InfiniteListSlots } from "../../types";
import {
  DefaultEmpty,
  DefaultFooter,
  DefaultInitialLoader,
  DefaultNextPageError,
} from "../defaults";
import { InfiniteListLoader } from "../infinite-list-loader/infinite-list-loader";

export interface SimpleInfiniteListProps<T>
  extends InfiniteListData<T>,
    InfiniteListSlots<T> {
  /** Shown instead of the items while the first page loads. */
  renderInitialLoader?: () => ReactNode;
  /**
   * Layout of the items. `custom` adds no layout (display, columns or gap): the `className` defines all of it, e.g. a
   * Tailwind `@utility`, whose classes `tailwind-merge` can't tell apart from the default ones and would keep both.
   * @default "vertical"
   */
  listVariant?: "vertical" | "horizontal" | "grid" | "custom";
  className?: string;
}

/**
 * Infinite list that renders every item (no virtualization). Simpler, and fine for short lists
 * and grids. It needs no scroll container: the page (or the closest scrolling ancestor) scrolls.
 */
export function SimpleInfiniteListRoot<T>({
  data,
  className,
  listVariant = "vertical",
  isNextPageAvailable,
  isLoadingInitialData,
  isFetchingNextPage,
  isNextPageError = false,
  onScrollNearEnd,
  getItemKey,
  renderItem,
  renderInitialLoader = DefaultInitialLoader,
  renderNextPageLoader,
  renderNextPageError = DefaultNextPageError,
  renderEmpty = DefaultEmpty,
  renderFooter = DefaultFooter,
}: SimpleInfiniteListProps<T>) {
  if (isLoadingInitialData) {
    return <RenderSlot render={renderInitialLoader} props={undefined} />;
  }

  const items = data ?? [];
  // ? Without `onScrollNearEnd` the list can't load more by itself (e.g. a manual "load more" button
  // ? outside of it), so the loader only shows up while a page is being fetched.
  const canLoadMore = onScrollNearEnd !== undefined || isFetchingNextPage;
  const hasNextPageError =
    isNextPageAvailable &&
    isNextPageError &&
    !isFetchingNextPage &&
    onScrollNearEnd !== undefined;
  const showNextPageLoader =
    isNextPageAvailable && !hasNextPageError && canLoadMore;

  return (
    <ul
      aria-busy={isFetchingNextPage}
      className={cn(
        "h-fit w-full",
        {
          "gap-8": listVariant !== "custom",
          "flex flex-col": listVariant === "vertical",
          "flex flex-row": listVariant === "horizontal",
          "grid grid-cols-[repeat(auto-fill,minmax(300px,350px))]":
            listVariant === "grid",
        },
        className,
      )}
    >
      {items.map((item, index) => (
        <li key={getItemKey?.(item, index) ?? index}>
          <RenderSlot render={renderItem} props={{ item, index }} />
        </li>
      ))}
      <li>
        {!isNextPageAvailable && items.length > 0 && (
          <RenderSlot render={renderFooter} props={undefined} />
        )}
        {!isNextPageAvailable && items.length === 0 && (
          <RenderSlot render={renderEmpty} props={undefined} />
        )}
        {hasNextPageError && (
          <RenderSlot
            render={renderNextPageError}
            props={{ retry: () => onScrollNearEnd?.() }}
          />
        )}
        {showNextPageLoader && (
          <InfiniteListLoader
            disabled={isFetchingNextPage}
            loadedCount={items.length}
            onLoaderInView={onScrollNearEnd}
          >
            {renderNextPageLoader ? (
              <RenderSlot render={renderNextPageLoader} props={undefined} />
            ) : null}
          </InfiniteListLoader>
        )}
      </li>
    </ul>
  );
}
