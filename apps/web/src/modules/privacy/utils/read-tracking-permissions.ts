import { usePrivacyStore } from "@/modules/privacy/stores/privacy-store";
import { getTrackingPermissions } from "@/modules/privacy/utils/get-tracking-permissions";
import { hasPrivacySignal } from "@/modules/privacy/utils/has-privacy-signal";

/** What the tracking tools may do right now, read from the store at this moment. For code that is not a component (the tracker and the error reporter ask it on every event). */
export function readTrackingPermissions() {
	return getTrackingPermissions(usePrivacyStore.getState().choices, { privacySignal: hasPrivacySignal() });
}
