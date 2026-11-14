import { getFrameAncestor } from "../utils/get-frame-ancestor";

export interface BuildSecurityHeadersOptions {
	/** `VITE_UMAMI_URL`: the Umami server, whose origin may frame the app (its dashboard shows the recorded sessions). */
	umamiUrl?: string;
}

/**
 * The security headers of every response. The Content-Security-Policy carries only `frame-ancestors` on purpose: a full policy would
 * block Sentry, Umami and the media origins.
 */
export function buildSecurityHeaders({ umamiUrl }: BuildSecurityHeadersOptions = {}) {
	const frameAncestor = getFrameAncestor(umamiUrl);

	return {
		"Strict-Transport-Security": "max-age=31536000",
		"X-Content-Type-Options": "nosniff",
		"Referrer-Policy": "strict-origin-when-cross-origin",
		"Permissions-Policy": "camera=(self), microphone=(self), geolocation=(), payment=(), usb=()",
		"Content-Security-Policy": `frame-ancestors 'self'${frameAncestor && ` ${frameAncestor}`}`,
	};
}
