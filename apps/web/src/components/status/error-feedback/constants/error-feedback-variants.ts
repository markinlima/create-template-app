import { tv } from "tailwind-variants";

export const errorFeedbackVariants = tv({
	base: "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-xl p-6 text-center text-balance md:p-12",
	variants: {
		variant: {
			default: "bg-background",
			card: "border-border bg-card border shadow-sm",
			destructive: "border-destructive/20 bg-destructive/5 border",
			muted: "bg-muted/50",
			transparent: "bg-transparent",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});
