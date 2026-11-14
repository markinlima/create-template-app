import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { PrivacyChoices } from "@/modules/privacy/types/privacy-choices";

// ? Opt-in: nothing is tracked until the visitor allows it. FIXME: Placeholder decision, confirm it for each project (and the law of its market).
export const DEFAULT_PRIVACY_CHOICES: PrivacyChoices = {
	anonymousMetrics: false,
	improveWithMyData: false,
};

interface PrivacyState {
	choices: PrivacyChoices;
	/** Changes some of the choices. The consent screen of the project calls it; nothing else in the app does. */
	setChoices: (choices: Partial<PrivacyChoices>) => void;
}

/** The visitor's choices about tracking, kept in the browser. FIXME: Placeholder, the project adds the consent screen that changes it. */
export const usePrivacyStore = create<PrivacyState>()(
	persist(
		(set) => ({
			choices: DEFAULT_PRIVACY_CHOICES,
			setChoices: (choices) => set((state) => ({ choices: { ...state.choices, ...choices } })),
		}),
		{
			name: "privacy-choices",
			storage: createJSONStorage(() => localStorage),
			partialize: ({ choices }) => ({ choices }),
		},
	),
);
