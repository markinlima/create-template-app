import { TEST_STACK_ENV } from "../../constants/test-stack";

/**
 * The envs of the test stack of an app. The network is its own (not the external one of the dev stack), so the services of the dev
 * stack, which have the same names, are never reached by a test.
 *
 * @param app - The name of the app, e.g. `backend`.
 * @param target - The script of the app the tests runner runs, e.g. `test:unit`.
 * @returns The envs that fill the `${VAR}` of the compose files.
 */
export function buildTestStackEnv(
  app: string,
  target: string,
): Record<string, string> {
  return {
    ...TEST_STACK_ENV,
    DEV_NET: `${app}-test`,
    DEV_NET_EXTERNAL: "false",
    TEST_TARGET: target,
  };
}
