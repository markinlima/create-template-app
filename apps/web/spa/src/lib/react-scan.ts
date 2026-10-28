import { isClientSide } from "@web/shared/utils/is-client-side";

import { clientEnv } from "@/lib/env/client";

export function useReactScan() {
	if (isClientSide() && clientEnv.VITE_DEBUG_MODE === true) {
		import("react-scan").then(({ scan }) => {
			scan({
				enabled: true,
			});
		});
	}
}
