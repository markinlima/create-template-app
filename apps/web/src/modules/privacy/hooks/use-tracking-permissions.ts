import { useMemo } from "react";

import { usePrivacyStore } from "@/modules/privacy/stores/privacy-store";
import { getTrackingPermissions } from "@/modules/privacy/utils/get-tracking-permissions";
import { hasPrivacySignal } from "@/modules/privacy/utils/has-privacy-signal";

/** What each tracking tool may do, from the choices of the visitor. Changes when they change a choice. */
export function useTrackingPermissions() {
	const choices = usePrivacyStore((state) => state.choices);

	return useMemo(() => getTrackingPermissions(choices, { privacySignal: hasPrivacySignal() }), [choices]);
}
