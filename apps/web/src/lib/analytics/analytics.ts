import { createTracker } from "@web/analytics";

import type { WebAnalyticsEvents } from "@/lib/analytics/analytics-events";
import { isUmamiEnabled } from "@/lib/analytics/umami";
import { readTrackingPermissions } from "@/modules/privacy/utils/read-tracking-permissions";

/** The tracker of the app: `analytics.track("sign-up")`. It sends nothing while Umami is not configured or the visitor has not allowed the metrics. */
export const analytics = createTracker<WebAnalyticsEvents>({
	// ? Asked on every event: the visitor can turn the metrics off at any moment.
	enabled: () => isUmamiEnabled && readTrackingPermissions().metrics,
	debug: () => import.meta.env.DEV,
});
