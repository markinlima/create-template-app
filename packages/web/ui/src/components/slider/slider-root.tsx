import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "tailwind-variants";

interface SliderProps extends SliderPrimitive.Root.Props {
  /**
   * Draws the thumb. Without it the thumb is invisible but still there, so the slider can be
   * focused and moved with the keyboard; it shows up only while focused by the keyboard.
   */
  showThumb?: boolean;
  /** Accessible name of the slider (the thumb is what screen readers focus). */
  thumbLabel?: string;
  /** Text read by screen readers for the current value, e.g. "0:12 of 1:30". */
  getThumbValueText?: (value: number) => string;
}

export function SliderRoot({
  className,
  showThumb = true,
  thumbLabel,
  getThumbValueText,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "data-orientation[vertical]:h-full data-[orientation=horizontal]:w-full",
        className,
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-disabled:opacity-50">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow select-none overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-2 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-2"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="select-none bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          />
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          getAriaLabel={thumbLabel ? () => thumbLabel : undefined}
          getAriaValueText={
            getThumbValueText
              ? (_formattedValue, thumbValue) => getThumbValueText(thumbValue)
              : undefined
          }
          className={cn(
            "relative block size-3 shrink-0 select-none rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] after:absolute after:-inset-2 hover:ring-3 focus-visible:outline-hidden focus-visible:ring-3 active:ring-3 disabled:pointer-events-none disabled:opacity-50",
            {
              "pointer-events-none opacity-0 focus-visible:opacity-100":
                !showThumb,
            },
          )}
        />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}
