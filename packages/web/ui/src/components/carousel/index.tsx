import { CarouselContent } from "./components/content";
import { CarouselItem } from "./components/item";
import { CarouselNext } from "./components/next";
import { CarouselPrevious } from "./components/previous";
import { CarouselProvider } from "./components/provider";

/** A carousel of slides. Use `Carousel.content`, `Carousel.item`, `Carousel.previous` and `Carousel.next`. */
export const Carousel = Object.assign(CarouselProvider, {
  content: CarouselContent,
  item: CarouselItem,
  next: CarouselNext,
  previous: CarouselPrevious,
});
