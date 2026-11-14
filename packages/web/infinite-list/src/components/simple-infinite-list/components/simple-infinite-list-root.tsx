import type { ReactNode } from "react";
import { cn } from "tailwind-variants";

import type { InfiniteListData } from "../../../types/infinite-list-data";
import type { InfiniteListSlots } from "../../../types/infinite-list-slots";
import { DefaultEmpty } from "../../internal/defaults/default-empty";
import { DefaultFooter } from "../../internal/defaults/default-footer";
import { DefaultInitialLoader } from "../../internal/defaults/default-initial-loader";
import { DefaultNextPageError } from "../../internal/defaults/default-next-page-error";
import { InfiniteListLoader } from "../../internal/infinite-list-loader";
import { RenderSlot } from "../../internal/render-slot";

export interface SimpleInfiniteListProps<T>
  extends InfiniteListData<T>,
    InfiniteListSlots<T> {
  /** Shown instead of the items while the first page loads. */
  renderInitialLoader?: () => ReactNode;
  /**
   * Layout of the items. `custom` adds no layout (display, columns or gap): the `className` defines all of it, e.g. a
   * Tailwind `@utility`, whose classes `tailwind-merge` can't tell apart from the default ones and would keep both.
   * @defaultValue "vertical"
   */
  listVariant?: "vertical" | "horizontal" | "grid" | "custom";
  /** Classes of the list element. */
  className?: string;
  /** Space above the list in px, e.g. the height of an absolute `InfiniteListScroll.header` that floats over it. */
  marginTop?: number;
}

/**
 * Infinite list that renders every item (no virtualization). Simpler, and fine for short lists
 * and grids. It needs no scroll container: the page (or the closest scrolling ancestor) scrolls.
 */
export function SimpleInfiniteListRoot<T>({
  data,
  className,
  listVariant = "vertical",
  marginTop,
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
  // NOTE: without `onScrollNearEnd` the list can't load more by itself, so the loader shows only while fetching
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
      style={{ marginTop }}
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
      {/* NOTE: spans every column in a grid; no effect in the other layouts */}
      <li className="col-span-full">
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
            {!!renderNextPageLoader && (
              <RenderSlot render={renderNextPageLoader} props={undefined} />
            )}
          </InfiniteListLoader>
        )}
      </li>
    </ul>
  );
}
