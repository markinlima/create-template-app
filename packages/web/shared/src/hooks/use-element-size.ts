import { type RefObject, useEffect, useState } from "react";

interface ElementSize {
  width: number;
  height: number;
}

/** Size of an element, kept up to date with a `ResizeObserver`. */
export function useElementSize(
  elementRef: RefObject<HTMLElement | null>,
): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const borderBox = entry.borderBoxSize[0];

      setSize(
        borderBox
          ? { width: borderBox.inlineSize, height: borderBox.blockSize }
          : {
              width: entry.contentRect.width,
              height: entry.contentRect.height,
            },
      );
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef]);

  return size;
}
