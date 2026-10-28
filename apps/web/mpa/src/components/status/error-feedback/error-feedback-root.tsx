import { cn, tv, type VariantProps } from "tailwind-variants";

export const errorFeedbackVariants = tv({
	base: "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-xl p-6 text-center md:p-12",
	variants: {
		variant: {
			default: "bg-background",
			card: "border border-border bg-card shadow-sm",
			destructive: "border border-destructive/20 bg-destructive/5",
			muted: "bg-muted/50",
			transparent: "bg-transparent",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

interface ErrorFeedbackProps extends React.ComponentProps<"div">, VariantProps<typeof errorFeedbackVariants> {}

export function ErrorFeedbackRoot({ className, variant, ...props }: ErrorFeedbackProps) {
	return <div data-slot="error-feedback" className={cn(errorFeedbackVariants({ variant, className }))} {...props} />;
}
