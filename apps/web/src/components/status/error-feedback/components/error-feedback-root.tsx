import { cn, type VariantProps } from "tailwind-variants";

import { errorFeedbackVariants } from "../constants/error-feedback-variants";

interface ErrorFeedbackProps extends React.ComponentProps<"div">, VariantProps<typeof errorFeedbackVariants> {}

export function ErrorFeedbackRoot({ className, variant, ...props }: ErrorFeedbackProps) {
	return <div data-slot="error-feedback" className={cn(errorFeedbackVariants({ variant, className }))} {...props} />;
}
