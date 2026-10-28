import { cn } from "tailwind-variants";

export function ErrorFeedbackDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p data-slot="error-feedback-description" className={cn("max-w-md text-muted-foreground text-sm/relaxed", className)} {...props} />
	);
}
