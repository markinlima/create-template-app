import type { ComponentType } from "react";
import { cn } from "tailwind-variants";

import { Button, type ButtonVariants } from "@web/ui/button";

export interface ErrorFeedbackAction {
	label: string;
	onClick: () => void;
	icon?: ComponentType<{ className?: string }>;
	variant?: ButtonVariants["variant"];
}

interface ErrorFeedbackActionsProps extends React.ComponentProps<"div"> {
	actions?: ErrorFeedbackAction[];
	children?: React.ReactNode;
}

export function ErrorFeedbackActions({ className, actions, children, ...props }: ErrorFeedbackActionsProps) {
	if (!actions && !children) {
		return null;
	}

	const content =
		children ||
		actions?.map((action) => (
			<Button key={action.label} raised onClick={action.onClick} variant={action.variant}>
				{!!action.icon && <action.icon />}
				{action.label}
			</Button>
		));

	return (
		<div data-slot="error-feedback-actions" className={cn("mt-2 flex flex-wrap items-center justify-center gap-3", className)} {...props}>
			{content}
		</div>
	);
}
