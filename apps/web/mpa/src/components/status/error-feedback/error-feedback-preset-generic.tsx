import { Link } from "@tanstack/react-router";
import { AlertTriangleIcon, HomeIcon, type LucideIcon, RefreshCwIcon } from "lucide-react";
import { useState } from "react";
import type { VariantProps } from "tailwind-variants";

import { getRandomItem } from "@web/shared/utils/get-random-item";
import { Button } from "@web/ui/button";

import { APP_CONFIG } from "@/core/info";
import { errorPhrases, errorTitles } from "@/core/phrases";
import { routes } from "@/core/routes";

import { ErrorFeedbackActions } from "./error-feedback-actions";
import { ErrorFeedbackDescription } from "./error-feedback-description";
import { ErrorFeedbackIcon } from "./error-feedback-icon";
import { ErrorFeedbackRoot, type errorFeedbackVariants } from "./error-feedback-root";
import { ErrorFeedbackTitle } from "./error-feedback-title";

interface ErrorFeedbackPresetGenericProps extends React.ComponentProps<"div"> {
	icon?: LucideIcon;
	title?: string;
	description?: string;
	reset?: () => void;
	showHomeButton?: boolean;
	error?: Error;
	variant?: VariantProps<typeof errorFeedbackVariants>["variant"];
}

export function ErrorFeedbackPresetGeneric({
	icon: Icon = AlertTriangleIcon,
	title,
	description,
	reset,
	showHomeButton = true,
	className,
	error,
	variant,
	...props
}: ErrorFeedbackPresetGenericProps) {
	const [phrases] = useState(() => ({
		title: title || getRandomItem(errorTitles),
		description: description || getRandomItem(errorPhrases),
	}));

	return (
		<ErrorFeedbackRoot variant={variant} className={className} {...props}>
			<ErrorFeedbackIcon>
				<Icon />
			</ErrorFeedbackIcon>
			<ErrorFeedbackTitle>{phrases.title}</ErrorFeedbackTitle>
			<ErrorFeedbackDescription>{phrases.description}</ErrorFeedbackDescription>
			<ErrorFeedbackActions>
				{!!reset && (
					<Button raised onClick={reset} variant="outline">
						<RefreshCwIcon />
						Tentar Novamente
					</Button>
				)}
				{!!showHomeButton && (
					<Link to={routes.HOME_URL} className="flex items-center gap-2">
						<Button raised variant="outline">
							<HomeIcon />
							Voltar para o início
						</Button>
					</Link>
				)}
			</ErrorFeedbackActions>
			<p className="text-center text-muted-foreground text-sm">
				Se o problema persistir, entre em contato com o
				<a href={APP_CONFIG.social.support} target="_blank" className="ml-1 text-info underline" rel="noopener">
					suporte técnico!
				</a>
			</p>
		</ErrorFeedbackRoot>
	);
}
