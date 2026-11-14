/** Whether the browser asks not to be tracked: Global Privacy Control or Do Not Track. `false` on the server. */
export function hasPrivacySignal() {
	if (typeof navigator === "undefined") {
		return false;
	}

	const { globalPrivacyControl, doNotTrack } = navigator as Navigator & { globalPrivacyControl?: boolean };

	return globalPrivacyControl === true || doNotTrack === "1";
}
