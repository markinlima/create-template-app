import type { ComponentPropsWithRef, ReactNode } from "react";

/** One dot of a carousel, a plain button. It is used through {@link useDotButton}, not exported by the lib. */
export function DotButton({
  children,
  ...props
}: ComponentPropsWithRef<"button"> & { children?: ReactNode }) {
  return (
    <button type="button" {...props}>
      {children}
    </button>
  );
}
