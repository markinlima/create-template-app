import type { ComponentProps } from "react";

/** A link of an alert's text: opens in another tab, so the app (and the alert) stay where they are. */
export function AlertMarkdownLink({ href, children }: ComponentProps<"a">) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-4"
    >
      {children}
    </a>
  );
}
