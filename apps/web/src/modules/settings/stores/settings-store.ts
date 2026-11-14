import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { DEFAULT_SETTINGS } from "@/modules/settings/constants/default-settings";
import { type AppSettings, settingsSchema } from "@/modules/settings/schemas/settings-schema";

interface SettingsState {
	settings: AppSettings;
	/** Changes some of the settings. The settings page calls it. */
	setSettings: (settings: Partial<AppSettings>) => void;
}

/** The settings of the visitor, kept in the browser. */
export const useSettingsStore = create<SettingsState>()(
	persist(
		(set) => ({
			settings: DEFAULT_SETTINGS,
			setSettings: (settings) => set((state) => ({ settings: { ...state.settings, ...settings } })),
		}),
		{
			name: "app-settings",
			storage: createJSONStorage(() => localStorage),
			partialize: ({ settings }) => ({ settings }),
			// NOTE: the stored value is parsed again, so an old or edited value falls back to the defaults instead of breaking the app.
			merge: (persisted, current) => {
				const stored = (persisted ?? {}) as { settings?: unknown };

				return { ...current, settings: settingsSchema.parse(stored.settings ?? {}) };
			},
		},
	),
);
