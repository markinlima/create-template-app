import { createRootRouteWithContext, HeadContent, Outlet } from "@tanstack/react-router";

import { ToastProvider } from "@web/notification";
import { Tooltip } from "@web/ui/tooltip";

import { DevtoolsWrapper } from "@/components/devtools-wrapper";
import { APP_CONFIG } from "@/core/info";
import { AppThemeProvider } from "@/core/themes/app-theme-provider";
import { useReactScan } from "@/lib/react-scan";
import type { RouteContext } from "@/types/tanstack-router";

export const Route = createRootRouteWithContext<RouteContext>()({
	component: RootComponent,
	head: () => ({
		meta: [
			// FIXME: Placeholder SEO. Replace it with the real texts and images of the project.
			{ title: APP_CONFIG.brand.name },
			{ name: "description", content: APP_CONFIG.brand.description },
			{ name: "application-name", content: APP_CONFIG.brand.name },
			{ name: "referrer", content: "origin-when-cross-origin" },
			{ property: "og:title", content: APP_CONFIG.brand.name },
			{ property: "og:description", content: APP_CONFIG.brand.description },
			{ property: "og:site_name", content: APP_CONFIG.brand.name },
			{ property: "og:type", content: "website" },
			{ name: "twitter:card", content: "summary_large_image" },
		],
		links: [
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
			{ rel: "manifest", href: "/manifest.json" },
		],
	}),
});

function RootComponent() {
	useReactScan();

	return (
		<AppThemeProvider>
			<HeadContent />
			<ToastProvider position="bottom-right">
				<Tooltip.provider>
					<Outlet />
					<DevtoolsWrapper />
				</Tooltip.provider>
			</ToastProvider>
		</AppThemeProvider>
	);
}
