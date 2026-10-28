import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

export function AppLogoRoot({ className, children, ...props }: ComponentProps<"div">) {
	return (
		<div className={cn("flex items-center gap-2", className)} {...props}>
			{children}
		</div>
	);
}
