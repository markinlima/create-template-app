const UMAMI_DISABLED_KEY = "umami.disabled";

/** Tells the Umami tracker (the key it checks on every send) to stop sending, or lets it send again. Without storage it does nothing. */
export function setUmamiDisabled(isDisabled: boolean) {
	try {
		if (isDisabled) {
			localStorage.setItem(UMAMI_DISABLED_KEY, "1");
		} else {
			localStorage.removeItem(UMAMI_DISABLED_KEY);
		}
	} catch {
		// ? Without storage (private window, blocked data) the tracker is simply not added while the metrics are off.
	}
}
