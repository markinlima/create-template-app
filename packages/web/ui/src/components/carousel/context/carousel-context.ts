import type useEmblaCarousel from "embla-carousel-react";
import { createContext, useContext } from "react";

import type { CarouselProps } from "../components/provider";

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

/** The context of a {@link Carousel}: its Embla instance. It is `null` outside of one. */
export const CarouselContext = createContext<CarouselContextProps | null>(null);

/** Reads the context of a {@link Carousel}. It throws outside of one. */
export function useCarouselContext() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}
