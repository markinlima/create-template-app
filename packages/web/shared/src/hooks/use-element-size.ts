import { type RefObject, useLayoutEffect, useState } from "react";

import { EMPTY_ELEMENT_SIZE } from "../constants/empty-element-size";
import type { ElementSize } from "../types/element-size";

/**
 * Size of an element, kept up to date with a `ResizeObserver`. The element can show up (or be replaced) after the first render, e.g.
 * a part of the page that only renders in some states: the observer follows the element the ref holds now, and the size is zero
 * while there is none.
 *
 * @param elementRef - Ref of the element to measure.
 * @returns The layout size of the element, in pixels.
 * @example
 * const headerRef = useRef<HTMLElement>(null);
 * const { height } = useElementSize(headerRef);
 */
export function useElementSize(
  elementRef: RefObject<HTMLElement | null>,
): ElementSize {
  const [size, setSize] = useState<ElementSize>(EMPTY_ELEMENT_SIZE);
  const [element, setElement] = useState<HTMLElement | null>(null);

  // NOTE: a ref does not re-render when it changes, so its element is copied to the state after every render
  useLayoutEffect(() => {
    setElement(elementRef.current);
  });

  // NOTE: a layout effect, so the first size is known before the paint and what is laid out around the element does not jump
  useLayoutEffect(() => {
    if (!element) {
      setSize(EMPTY_ELEMENT_SIZE);
      return;
    }

    // NOTE: offset size, not getBoundingClientRect: a transform (a dialog scaling in) would change the numbers
    setSize({ width: element.offsetWidth, height: element.offsetHeight });

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
  }, [element]);

  return size;
}
