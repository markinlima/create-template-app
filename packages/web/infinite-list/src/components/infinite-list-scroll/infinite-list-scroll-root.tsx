import { type HTMLAttributes, type ReactNode, useRef, useState } from "react";
import { cn } from "tailwind-variants";

import { useElementSize } from "@web/shared/hooks/use-element-size";

import {
  InfiniteListScrollContext,
  type InfiniteListScrollContextProps,
} from "../../context";

interface InfiniteListScrollRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * Identifies this scroll container for scroll restoration. It is exposed as
   * `data-scroll-restoration-id`, which is what routers use to find the element.
   */
  scrollRestorationId?: string;
  /** Extra space (px) the list leaves at the top, besides the header height. */
  additionalHeaderHeight?: number;
}

/**
 * The scrolling container the lists live in. It owns the scroll element and the header size,
 * and shares them with the list, the header and the scroll to top button through context.
 */
export function InfiniteListScrollRoot({
  children,
  className,
  additionalHeaderHeight = 0,
  scrollRestorationId,
  ...props
}: InfiniteListScrollRootProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerHeaderRef = useRef<HTMLDivElement | null>(null);
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(
    null,
  );

  const { height: headerHeight } = useElementSize(scrollContainerHeaderRef);

  function handleRef(element: HTMLDivElement | null) {
    scrollContainerRef.current = element;
    setScrollElement(element);
  }

  const value: InfiniteListScrollContextProps = {
    scrollContainerRef,
    scrollElement,
    scrollContainerHeaderRef,
    scrollRestorationId,
    headerHeight: headerHeight + additionalHeaderHeight,
  };

  return (
    <InfiniteListScrollContext value={value}>
      <div
        {...props}
        ref={handleRef}
        data-scroll-restoration-id={scrollRestorationId}
        className={cn("relative h-full overflow-y-auto", className)}
      >
        {children}
      </div>
    </InfiniteListScrollContext>
  );
}
