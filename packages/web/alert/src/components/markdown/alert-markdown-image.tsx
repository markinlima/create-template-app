import type { ComponentProps } from "react";

/** An image of an alert's text: it never overflows the dialog and only loads when it is about to be seen. */
export function AlertMarkdownImage({ src, alt }: ComponentProps<"img">) {
  return (
    <img
      src={typeof src === "string" ? src : undefined}
      alt={alt ?? ""}
      loading="lazy"
      className="h-auto max-w-full rounded-md"
    />
  );
}
