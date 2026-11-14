import { z } from "zod";

/** The settings of the app. Each key falls back to its default when the stored value is invalid. */
export const settingsSchema = z.object({
	/** Turns off the animations and transitions of the page (the same as the browser setting). */
	reducedMotion: z.boolean().catch(false),
});

export type AppSettings = z.infer<typeof settingsSchema>;
