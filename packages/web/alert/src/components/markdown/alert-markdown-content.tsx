import type { MarkdownAlertContent } from "../../types/content/alert-content";
import type { AlertContentComponentProps } from "../../types/content/alert-content-components";
import { AlertBackButton } from "../controls/alert-back-button";
import { AlertBody } from "../controls/alert-body";
import { AlertFooter } from "../controls/alert-footer";
import { AlertNextButton } from "../next-button/alert-next-button";
import { AlertMarkdown } from "./alert-markdown";

/** The built-in kind of content: a markdown text, with the back and next buttons. It is also the example of how to make another kind. */
export function AlertMarkdownContent({
  content,
}: AlertContentComponentProps<MarkdownAlertContent>) {
  return (
    <>
      <AlertBody>
        <AlertMarkdown>{content.body}</AlertMarkdown>
      </AlertBody>
      <AlertFooter>
        <AlertBackButton />
        <AlertNextButton cooldownSeconds={content.cooldownSeconds}>
          {content.buttonLabel}
        </AlertNextButton>
      </AlertFooter>
    </>
  );
}
