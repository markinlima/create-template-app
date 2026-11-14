import { clientEnv } from "@/lib/env/client";
import { warnFeatureDisabled } from "@/lib/warn-feature-disabled";

export interface UmamiConfig {
	url?: string;
	websiteId?: string;
	/** The file name of the tracker script on the Umami server (`TRACKER_SCRIPT_NAME` there). */
	trackerScriptName?: string;
	/** The address on the Umami server that receives the events (`COLLECT_API_ENDPOINT` there). */
	collectApiEndpoint?: string;
}

const DEFAULT_TRACKER_SCRIPT_NAME = "script.js";
const DEFAULT_COLLECT_API_ENDPOINT = "/api/send";

/** Umami runs only when both the address of the server and the id of the website are set. */
export function isUmamiConfigured({ url, websiteId }: UmamiConfig) {
	return !!url && !!websiteId;
}

/** The address that receives the events of Umami, or `undefined` when it is not configured. */
export function getUmamiCollectUrl({ url, websiteId, collectApiEndpoint = DEFAULT_COLLECT_API_ENDPOINT }: UmamiConfig) {
	return isUmamiConfigured({ url, websiteId }) ? `${url}${collectApiEndpoint}` : undefined;
}

/** The scripts of Umami, the tracker first and the session recorder second. They are not in the page from the start: the privacy module adds each one when the visitor allows it. Nothing when Umami is not configured. */
export function buildUmamiScripts({ url, websiteId, trackerScriptName = DEFAULT_TRACKER_SCRIPT_NAME }: UmamiConfig) {
	if (!url || !websiteId) {
		return [];
	}

	return [
		{
			src: `${url}/${trackerScriptName}`,
			"data-website-id": websiteId,
			"data-performance": true,
			// ? The tracker itself stays quiet for a browser that sends "Do Not Track".
			"data-do-not-track": true,
			defer: true,
		},
		{
			// ? The recorder reads only `data-website-id` from its tag. The share of sessions kept, the mask level, the longest recording and the
			// ? Block Selector are settings of the website in the Umami dashboard (Websites > Edit > Replays & Heatmaps), not attributes.
			src: `${url}/recorder.js`,
			"data-website-id": websiteId,
			defer: true,
		},
	];
}

const umamiConfig: UmamiConfig = {
	url: clientEnv.VITE_UMAMI_URL,
	websiteId: clientEnv.VITE_UMAMI_WEBSITE_ID,
	trackerScriptName: clientEnv.VITE_UMAMI_TRACKER_SCRIPT_NAME,
	collectApiEndpoint: clientEnv.VITE_UMAMI_COLLECT_API_ENDPOINT,
};

export const isUmamiEnabled = isUmamiConfigured(umamiConfig);

if (!isUmamiEnabled) {
	warnFeatureDisabled({ feature: "Umami (analytics)", envs: ["VITE_UMAMI_URL", "VITE_UMAMI_WEBSITE_ID"] });
}

/** The tracker script of Umami (page views and events) with the envs of the app. `undefined` when Umami is not configured. */
export function getUmamiTrackerScript() {
	return buildUmamiScripts(umamiConfig)[0];
}

/** The session recorder script of Umami (replay and heatmap) with the envs of the app. `undefined` when Umami is not configured. */
export function getUmamiRecorderScript() {
	return buildUmamiScripts(umamiConfig)[1];
}

/** The address that receives the events of Umami, with the envs of the app. */
export const umamiCollectUrl = getUmamiCollectUrl(umamiConfig);
