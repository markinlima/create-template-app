import { clientEnvSchema } from "@shared/env/web";

export const clientEnv = clientEnvSchema.parse({
	...import.meta.env,
	// NOTE: the update checker defines `import.meta.env.VITE_BUILD_ID` as a literal at build time, so it is not in the spread above.
	VITE_BUILD_ID: import.meta.env.VITE_BUILD_ID,
});
