import { clientEnv } from "@/lib/env/client";

export function useReactScan() {
	if (clientEnv.VITE_DEBUG_MODE === true) {
		import("react-scan").then(({ scan }) => {
			scan({
				enabled: true,
			});
		});
	}
}
