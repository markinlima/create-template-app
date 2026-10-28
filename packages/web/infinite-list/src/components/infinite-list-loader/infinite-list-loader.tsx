import { type ReactNode, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

import { DefaultNextPageLoader } from "../defaults";

interface InfiniteListLoaderProps {
  /** Called when the loader gets in view and again, if still in view, once more items were loaded. */
  onLoaderInView?: () => unknown;
  /** Disables the trigger, e.g. while a page is already being fetched. */
  disabled: boolean;
  /** Number of items loaded so far. A new value means a page arrived. */
  loadedCount: number;
  children?: ReactNode;
}

/**
 * Element at the end of the list that triggers the next page when it enters the viewport.
 *
 * It fires again when a page arrives and the loader is still visible (a page too short to push it
 * off the screen), so the pagination doesn't stall. A failed fetch loads nothing, so it doesn't
 * fire again by itself: that would retry forever against a failing API.
 */
export function InfiniteListLoader({
  children,
  onLoaderInView,
  disabled,
  loadedCount,
}: InfiniteListLoaderProps) {
  const { ref, inView } = useInView();

  const onLoaderInViewRef = useRef(onLoaderInView);
  useEffect(() => {
    onLoaderInViewRef.current = onLoaderInView;
  });

  const lastTriggeredCount = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) {
      lastTriggeredCount.current = null;
      return;
    }

    if (disabled || lastTriggeredCount.current === loadedCount) {
      return;
    }

    lastTriggeredCount.current = loadedCount;
    onLoaderInViewRef.current?.();
  }, [inView, disabled, loadedCount]);

  return (
    <div ref={ref} className="w-full">
      {children ?? <DefaultNextPageLoader />}
    </div>
  );
}
