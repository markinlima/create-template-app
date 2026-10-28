import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { AppLogoIcon } from "@/assets/logos/app-logo-icon";

export function AppLogoLogo({ className, ...props }: ComponentProps<"svg">) {
	return <AppLogoIcon className={cn("size-8 shrink-0 text-primary", className)} {...props} />;
}
