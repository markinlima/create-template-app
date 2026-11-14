/**
 * Opening and closing of an accordion panel. Base UI sets the height of the panel in `--accordion-panel-height` and marks it with
 * `data-starting-style` and `data-ending-style`, so the panel grows from zero to its height and shrinks back.
 */
export const ACCORDION_MOTION = [
  "h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 ease-out",
  "data-ending-style:duration-150 data-ending-style:ease-in",
  "data-starting-style:h-0 data-ending-style:h-0",
].join(" ");
