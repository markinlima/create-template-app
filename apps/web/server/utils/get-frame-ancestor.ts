/** The origin (scheme, host and port) of the Umami server, which may frame the app; empty when Umami is not configured or the URL is not http(s). */
export function getFrameAncestor(umamiUrl: string | undefined) {
	if (!umamiUrl) {
		return "";
	}

	try {
		const url = new URL(umamiUrl);

		return url.protocol === "http:" || url.protocol === "https:" ? url.origin : "";
	} catch {
		return "";
	}
}
