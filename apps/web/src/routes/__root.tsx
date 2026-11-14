import { createRootRouteWithContext, HeadContent, Outlet } from "@tanstack/react-router";

import { ToastProvider } from "@web/toast";
import { Tooltip } from "@web/ui/tooltip";

import { DevtoolsWrapper } from "@/components/devtools-wrapper";
import { AppThemeProvider } from "@/core/themes/app-theme-provider";
import { clientEnv } from "@/lib/env/client";
import { useReactScan } from "@/lib/react-scan";
import { seo } from "@/lib/seo/seo";
import type { RouteContext } from "@/types/tanstack-router";

import "@/lib/sentry/sentry-sdk";

import { TrackingManager } from "@/modules/privacy/components/tracking-manager";
import { SettingsManager } from "@/modules/settings/components/settings-manager";
import { AppUpdatePopup } from "@/modules/update/components/app-update-popup";

export const Route = createRootRouteWithContext<RouteContext>()({
	component: RootComponent,
	head: () => ({
		meta: seo.buildDefaultMeta({ siteUrl: clientEnv.VITE_FRONTEND_URL }),
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
					<TrackingManager />
					<SettingsManager />
					<AppUpdatePopup />
					<Outlet />
					<DevtoolsWrapper />
				</Tooltip.provider>
			</ToastProvider>
		</AppThemeProvider>
	);
}
