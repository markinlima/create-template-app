import { createUpdateChecker } from "@web/update";

import { clientEnv } from "@/lib/env/client";

/**
 * The update check of the app: `useHasNewUpdate` tells that a newer build was published, `useUpdateData` gives the content of the update file.
 * The build id comes from `clientEnv`: without it the check could not tell the builds apart, so the app stops with a clear error.
 */
if (!clientEnv.VITE_BUILD_ID) {
	throw new Error("VITE_BUILD_ID is missing: the update checker needs the id of the build (set by the Vite config).");
}

export const { useHasNewUpdate, useUpdateData, check } = createUpdateChecker({
	currentBuildId: clientEnv.VITE_BUILD_ID,
});
