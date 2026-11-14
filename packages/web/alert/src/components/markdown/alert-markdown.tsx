import { Markdown, type MarkdownComponents } from "@tanstack/markdown/react";

import { AlertMarkdownImage } from "./alert-markdown-image";
import { AlertMarkdownLink } from "./alert-markdown-link";

// NOTE: only links and images need a component; the container styles the rest
// NOTE: raw HTML is not rendered and unsafe URLs (`javascript:`) are dropped
const components = {
  a: AlertMarkdownLink,
  img: AlertMarkdownImage,
} satisfies MarkdownComponents;

interface AlertMarkdownProps {
  children: string;
}

/** The text of an alert, written in markdown. */
export function AlertMarkdown({ children }: AlertMarkdownProps) {
  return (
    <div className="[&_blockquote]:text-muted-foreground [&_code]:bg-muted [&_hr]:border-border space-y-3 text-base leading-relaxed break-words [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_code]:rounded [&_code]:px-1 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5">
      <Markdown components={components}>{children}</Markdown>
    </div>
  );
}
