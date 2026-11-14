import type { ComponentProps } from "react";

// FIXME: Placeholder logo. Replace it with the real one.
export function AppLogoIcon(props: ComponentProps<"svg">) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
			<circle cx="12" cy="12" r="10" />
		</svg>
	);
}
