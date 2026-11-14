import { cn } from "tailwind-variants";

export function ErrorFeedbackMedia({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="error-feedback-media"
			className={cn(
				"text-muted-foreground mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:size-16 [&_svg]:shrink-0",
				className,
			)}
			{...props}
		/>
	);
}
