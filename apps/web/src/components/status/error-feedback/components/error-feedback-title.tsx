import { cn } from "tailwind-variants";

export function ErrorFeedbackTitle({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3 data-slot="error-feedback-title" className={cn("text-foreground text-xl font-semibold tracking-tight", className)} {...props} />
	);
}
