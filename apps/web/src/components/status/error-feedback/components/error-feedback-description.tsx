import { cn } from "tailwind-variants";

export function ErrorFeedbackDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p data-slot="error-feedback-description" className={cn("text-muted-foreground max-w-md text-sm/relaxed", className)} {...props} />
	);
}
