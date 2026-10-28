import { ArrowRight } from "lucide-react";
import { cn } from "tailwind-variants";

import { Button } from "../../button";
import { useCarouselContext } from "../context/carousel-context";

export function CarouselNext({
  className,
  variant = "primary",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { scrollNext, canScrollNext } = useCarouselContext();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn("size-8 rounded-full", className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}
