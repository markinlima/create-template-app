/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** The id of this build, defined by the `updateChecker` Vite plugin (see `@web/update`). */
	readonly VITE_BUILD_ID: string;
}
