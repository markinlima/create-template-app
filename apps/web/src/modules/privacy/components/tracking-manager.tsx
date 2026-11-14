import { useEffect } from "react";

import { analytics } from "@/lib/analytics/analytics";
import { getUmamiRecorderScript, getUmamiTrackerScript } from "@/lib/analytics/umami";
import { Sentry } from "@/lib/sentry/sentry-sdk";
import { useSession } from "@/modules/auth/hooks/use-session";
import { useTrackingPermissions } from "@/modules/privacy/hooks/use-tracking-permissions";
import { loadScript } from "@/modules/privacy/utils/load-script";
import { setUmamiDisabled } from "@/modules/privacy/utils/set-umami-disabled";

/**
 * Applies the privacy choices of the visitor to the tracking tools. It draws nothing and sits once, high in the tree (the root route).
 * - The tracker of Umami is added when the metrics are allowed, and told to stop when they are not.
 * - The recorder of Umami (replay and heatmap) is added only for who agreed to the tracking by id. A script can't be taken out of a page that
 *   already runs it, so turning it off stops the recording on the next load.
 * - The session of Umami and the user of Sentry carry the id of the user only for who agreed to the tracking by id.
 */
export function TrackingManager() {
	const permissions = useTrackingPermissions();
	const userId = useSession()?.user.id;

	useEffect(() => {
		setUmamiDisabled(!permissions.metrics);

		const tracker = getUmamiTrackerScript();

		if (permissions.metrics && tracker) {
			loadScript(tracker);
		}
	}, [permissions.metrics]);

	useEffect(() => {
		const recorder = getUmamiRecorderScript();

		if (permissions.recording && recorder) {
			loadScript(recorder);
		}
	}, [permissions.recording]);

	useEffect(() => {
		if (permissions.identify && userId) {
			analytics.identify(userId);
		}
	}, [permissions.identify, userId]);

	useEffect(() => {
		Sentry.setUser(permissions.identify && userId ? { id: userId } : null);
	}, [permissions.identify, userId]);

	return null;
}
