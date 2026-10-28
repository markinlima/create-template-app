import { type ReactNode, useEffect, useState } from "react";

import { useInfiniteListScrollContext } from "../../context";

interface InfiniteListScrollToTopProps {
  /** How far (px) the container must be scrolled for the button to show up. @default 300 */
  threshold?: number;
  /** Renders your own button. Call `scrollToTop` from its click handler. */
  children?: (actions: { scrollToTop: () => void }) => ReactNode;
}

/** Button that scrolls the container back to the top. Only shown after scrolling past `threshold`. */
export function InfiniteListScrollToTop({
  threshold = 300,
  children,
}: InfiniteListScrollToTopProps) {
  const { scrollElement } = useInfiniteListScrollContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!scrollElement) {
      return;
    }

    function handleScroll() {
      setIsVisible((scrollElement?.scrollTop ?? 0) > threshold);
    }

    handleScroll();
    scrollElement.addEventListener("scroll", handleScroll, { passive: true });

    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [scrollElement, threshold]);

  function scrollToTop() {
    scrollElement?.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!isVisible) {
    return null;
  }

  if (children) {
    return <>{children({ scrollToTop })}</>;
  }

  return (
    <button
      type="button"
      aria-label="Voltar ao topo"
      onClick={scrollToTop}
      className="fixed right-10 bottom-5 z-50 flex size-10 cursor-pointer items-center justify-center rounded-md border bg-primary text-primary-foreground"
    >
      ↑
    </button>
  );
}
