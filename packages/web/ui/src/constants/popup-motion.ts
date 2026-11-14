/**
 * Enter and leave of what Base UI opens next to an anchor (popover, menus, select, tooltip, hover card). Base UI marks the element with
 * `data-starting-style` while it enters and with `data-ending-style` while it leaves, and waits for the transition to end before it
 * removes it (it is not the Radix way, with `data-[state]` and keyframes). It grows from the anchor (`--transform-origin` is set by the
 * positioner) and slides a little away from the side it opens to. A select that opens over its trigger has no side, so it only scales.
 */
export const POPUP_MOTION = [
  "origin-(--transform-origin) transition-[opacity,scale,translate] duration-150 ease-out",
  "data-ending-style:duration-100 data-ending-style:ease-in",
  "data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
  "data-[side=bottom]:data-starting-style:-translate-y-1 data-[side=bottom]:data-ending-style:-translate-y-1",
  "data-[side=top]:data-starting-style:translate-y-1 data-[side=top]:data-ending-style:translate-y-1",
  "data-[side=left]:data-starting-style:translate-x-1 data-[side=left]:data-ending-style:translate-x-1",
  "data-[side=inline-start]:data-starting-style:translate-x-1 data-[side=inline-start]:data-ending-style:translate-x-1",
  "data-[side=right]:data-starting-style:-translate-x-1 data-[side=right]:data-ending-style:-translate-x-1",
  "data-[side=inline-end]:data-starting-style:-translate-x-1 data-[side=inline-end]:data-ending-style:-translate-x-1",
].join(" ");
