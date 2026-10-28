import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "tailwind-variants";

import { useInfiniteListScrollContext } from "../../context";

interface InfiniteListScrollHeaderProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** `absolute` floats over the list (which leaves room for it); `relative` takes its own space. */
  variant?: "relative" | "absolute";
}

/** Header of the scroll container. Its height is measured so the list can start below it. */
export function InfiniteListScrollHeader({
  children,
  variant = "absolute",
  className,
  ...props
}: InfiniteListScrollHeaderProps) {
  const { scrollContainerHeaderRef } = useInfiniteListScrollContext();

  return (
    <header
      {...props}
      ref={scrollContainerHeaderRef}
      className={cn(
        "relative flex w-full items-center justify-center",
        { "absolute top-0 z-10": variant === "absolute" },
        className,
      )}
    >
      {children}
    </header>
  );
}
