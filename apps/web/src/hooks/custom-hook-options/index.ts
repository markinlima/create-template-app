import type { HookOptionsFactories } from "./types";

/**
 * Every custom hook option of the app, one file per domain. To customize a generated hook,
 * add it to the file of its domain (`defineHookOptions`) and register that file here:
 *
 *   export const customHookOptions: HookOptionsFactories = { ...userHookOptions };
 */
export const customHookOptions: HookOptionsFactories = {};
