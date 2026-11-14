/** What the user can choose about their data (the switches). */
export interface PrivacyChoices {
	/** Page views and product events, with no id. */
	anonymousMetrics: boolean;
	/** The tracking by id, with the recording of the session. */
	improveWithMyData: boolean;
}
