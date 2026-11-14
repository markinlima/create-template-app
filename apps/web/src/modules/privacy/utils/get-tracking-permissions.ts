import type { PrivacyChoices } from "@/modules/privacy/types/privacy-choices";

export interface TrackingPermissions {
	/** Page views and product events, with no id of the user. */
	metrics: boolean;
	/** Ties the metrics and the reports of errors to the id of the user. */
	identify: boolean;
	/** Records the session of the user (replay and heatmap). */
	recording: boolean;
}

export interface GetTrackingPermissionsOptions {
	/** The browser asks not to be tracked (Global Privacy Control or Do Not Track). The tracking by id and the recording are not started then, even when the user agreed. */
	privacySignal?: boolean;
}

/**
 * What each tracking tool may do, from the choices of the user. The two choices are independent: `anonymousMetrics` is only the anonymous
 * events of Umami, and `improveWithMyData` is the permission to use the data of the user (the id, the recording and whatever else uses their
 * data). Umami runs when either one is on (the recording and the id need its session): with only the second on, what it records is tied to the
 * user, which they agreed to. The reports of errors are not here: they are always sent, anonymous
 * (they keep the app working), and only get the id of the user when `identify` is allowed.
 */
export function getTrackingPermissions(
	privacy: PrivacyChoices,
	{ privacySignal = false }: GetTrackingPermissionsOptions = {},
): TrackingPermissions {
	const improve = privacy.improveWithMyData && !privacySignal;

	return {
		metrics: privacy.anonymousMetrics || improve,
		identify: improve,
		recording: improve,
	};
}
