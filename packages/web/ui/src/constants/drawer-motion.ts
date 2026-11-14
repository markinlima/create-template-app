/** Enter and leave of a sheet (the mobile sidebar and the like): it slides in from its own edge (`data-side`). */
export const DRAWER_MOTION = [
  "transition-[translate] duration-250 ease-out data-ending-style:duration-200 data-ending-style:ease-in",
  "data-[side=right]:data-starting-style:translate-x-full data-[side=right]:data-ending-style:translate-x-full",
  "data-[side=left]:data-starting-style:-translate-x-full data-[side=left]:data-ending-style:-translate-x-full",
  "data-[side=top]:data-starting-style:-translate-y-full data-[side=top]:data-ending-style:-translate-y-full",
  "data-[side=bottom]:data-starting-style:translate-y-full data-[side=bottom]:data-ending-style:translate-y-full",
].join(" ");
