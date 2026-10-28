import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { APP_CONFIG } from "@/core/info";

export function AppLogoTitle({ className, children = APP_CONFIG.brand.name, ...props }: ComponentProps<"h2">) {
	return (
		<h2 className={cn("font-bold text-lg", className)} {...props}>
			{children}
		</h2>
	);
}
