import ReactMarkdown, { type Components } from "react-markdown";

import { AlertMarkdownImage } from "./alert-markdown-image";
import { AlertMarkdownLink } from "./alert-markdown-link";

// ? Only links and images need a component of their own. The rest is styled by the container, so the text looks the same
// ? whatever markdown the API sends. Raw HTML in the text is not rendered, and unsafe URLs (like `javascript:`) are dropped.
const components: Components = {
  a: AlertMarkdownLink,
  img: AlertMarkdownImage,
};

interface AlertMarkdownProps {
  children: string;
}

/** The text of an alert, written in markdown. */
export function AlertMarkdown({ children }: AlertMarkdownProps) {
  return (
    <div className="space-y-3 break-words text-base leading-relaxed [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:font-bold [&_h1]:text-2xl [&_h2]:font-bold [&_h2]:text-xl [&_h3]:font-bold [&_h3]:text-lg [&_hr]:border-border [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5">
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  );
}
