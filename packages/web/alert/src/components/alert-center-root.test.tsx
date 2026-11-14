import { describe, expectTypeOf, it } from "bun:test";

import type { ComponentProps } from "react";

import type {
  AlertContentBase,
  MarkdownAlertContent,
} from "../types/content/alert-content";
import type {
  AlertContentComponentProps,
  AlertContentComponents,
} from "../types/content/alert-content-components";

interface TermsFormContent extends AlertContentBase {
  type: "terms-form";
  body: string;
}

interface SurveyContent extends AlertContentBase {
  type: "survey";
  question: string;
}

type AppContent = MarkdownAlertContent | TermsFormContent | SurveyContent;

describe("AlertContentComponents", () => {
  it("asks for a component per custom type, and none for the built-in markdown", () => {
    expectTypeOf<keyof AlertContentComponents<AppContent>>().toEqualTypeOf<
      "terms-form" | "survey"
    >();
  });

  it("gives each component its own content, narrowed", () => {
    expectTypeOf<
      ComponentProps<AlertContentComponents<AppContent>["survey"]>
    >().toEqualTypeOf<AlertContentComponentProps<SurveyContent>>();
  });

  it("asks for nothing when only the built-in type is used", () => {
    expectTypeOf<
      keyof AlertContentComponents<MarkdownAlertContent>
    >().toEqualTypeOf<never>();
  });
});
