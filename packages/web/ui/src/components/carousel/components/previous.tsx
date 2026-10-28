import { ArrowLeft } from "lucide-react";
import { cn } from "tailwind-variants";

import { Button } from "../../button";
import { useCarouselContext } from "../context/carousel-context";

export function CarouselPrevious({
  className,
  variant = "primary",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { scrollPrev, canScrollPrev } = useCarouselContext();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn("size-8 rounded-full", className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}
