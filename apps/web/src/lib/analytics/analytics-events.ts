/**
 * The custom events of the app. Payloads are flat and anonymous: no free text, no ids of people, no personal data.
 * An event mapped to `undefined` has no payload. FIXME: Placeholder events, replace them with the ones the project measures.
 */
export type WebAnalyticsEvents = {
	// ? An event with no payload: `analytics.track("sign-up")`.
	"sign-up": undefined;
	// ? An event with a flat payload: `analytics.track("sign-in", { method: "email" })`.
	"sign-in": { method: "email" | "username" };
};
