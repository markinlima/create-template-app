import { cn } from "tailwind-variants";

import { useCarouselContext } from "../context/carousel-context";

export function CarouselContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarouselContext();

  return (
    <div
      ref={carouselRef}
      className="h-full overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex h-full items-center",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
}
