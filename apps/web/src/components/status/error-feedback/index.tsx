import { ErrorFeedbackActions } from "./components/error-feedback-actions";
import { ErrorFeedbackDescription } from "./components/error-feedback-description";
import { ErrorFeedbackIcon } from "./components/error-feedback-icon";
import { ErrorFeedbackMedia } from "./components/error-feedback-media";
import { ErrorFeedbackPresets } from "./components/error-feedback-presets";
import { ErrorFeedbackRoot } from "./components/error-feedback-root";
import { ErrorFeedbackTitle } from "./components/error-feedback-title";

export type { ErrorFeedbackAction } from "./components/error-feedback-actions";

export const ErrorFeedback = Object.assign(ErrorFeedbackRoot, {
	media: ErrorFeedbackMedia,
	icon: ErrorFeedbackIcon,
	title: ErrorFeedbackTitle,
	description: ErrorFeedbackDescription,
	actions: ErrorFeedbackActions,
	presets: ErrorFeedbackPresets,
});
