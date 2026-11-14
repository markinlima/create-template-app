import type { EmblaCarouselType } from "embla-carousel";
import { useCallback, useEffect, useState } from "react";

import type { DotButtonState } from "../types/dot-button-state";

/**
 * Keeps the dots of a carousel in step with an Embla instance: the selected dot, one per snap position, and a click that scrolls.
 *
 * @param emblaApi - The Embla instance, `undefined` until it is ready.
 * @param onButtonClick - Called after a dot scrolls the carousel.
 * @returns The state of the dots, see {@link DotButtonState}.
 */
export function useDotButton(
  emblaApi: EmblaCarouselType | undefined,
  onButtonClick?: (emblaApi: EmblaCarouselType) => void,
): DotButtonState {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) {
        return;
      }
      emblaApi.scrollTo(index);
      if (onButtonClick) {
        onButtonClick(emblaApi);
      }
    },
    [emblaApi, onButtonClick],
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
}
