import { useRuntimeConfig } from "nitro/runtime-config";

/**
 * Read the envs the app gave to `webServer({ env })` in its Vite config. They are copied into the server bundle when it is built, so the
 * container needs no env of its own for them: give only public values, never a secret.
 *
 * @typeParam TEnv - The shape of the envs the app gave. They go through `JSON.stringify` into the bundle, so give only JSON values
 * (strings, numbers, booleans); an `undefined` is dropped.
 * @returns The envs, with the types the app declares.
 * @throws When the app did not give `env` to `webServer()`.
 * @example
 * export const serverEnv = getServerEnv<{ VITE_API_URL: string }>();
 */
export function getServerEnv<TEnv extends Record<string, unknown>>() {
  const { env } = useRuntimeConfig();

  if (!env) {
    throw new Error(
      "No server env found: give `env` to `webServer()` in the Vite config",
    );
  }

  return env as TEnv;
}
