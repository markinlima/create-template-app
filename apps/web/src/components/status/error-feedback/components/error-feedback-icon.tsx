import { cn } from "tailwind-variants";

export function ErrorFeedbackIcon({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="error-feedback-icon"
			className={cn(
				"bg-destructive/10 text-destructive mb-2 flex size-20 shrink-0 items-center justify-center rounded-full [&_svg]:pointer-events-none [&_svg]:size-10 [&_svg]:shrink-0",
				className,
			)}
			{...props}
		/>
	);
}
