import { ErrorFeedbackActions } from "./error-feedback-actions";
import { ErrorFeedbackDescription } from "./error-feedback-description";
import { ErrorFeedbackIcon } from "./error-feedback-icon";
import { ErrorFeedbackMedia } from "./error-feedback-media";
import { ErrorFeedbackPresets } from "./error-feedback-presets";
import { ErrorFeedbackRoot } from "./error-feedback-root";
import { ErrorFeedbackTitle } from "./error-feedback-title";

export type { ErrorFeedbackAction } from "./error-feedback-actions";

export const ErrorFeedback = Object.assign(ErrorFeedbackRoot, {
	media: ErrorFeedbackMedia,
	icon: ErrorFeedbackIcon,
	title: ErrorFeedbackTitle,
	description: ErrorFeedbackDescription,
	actions: ErrorFeedbackActions,
	presets: ErrorFeedbackPresets,
});
