/** Enter and leave of a dialog. It is centered with `translate`, so only `scale` and `opacity` change. */
export const DIALOG_MOTION = [
  "transition-[opacity,scale] duration-150 ease-out data-ending-style:duration-100 data-ending-style:ease-in",
  "data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
].join(" ");
