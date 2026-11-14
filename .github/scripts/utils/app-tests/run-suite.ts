import { $ } from "bun";

/**
 * Runs one suite of the test stack of an app, then brings the stack down, pass or fail.
 *
 * @param path - Folder of the app.
 * @param suite - Suite name (`unit`, `integration` or `e2e`), passed as `TEST_TARGET=test:<suite>`.
 * @throws When the suite fails.
 */
export async function runSuite(path: string, suite: string) {
  const env = { ...process.env, TEST_TARGET: `test:${suite}` };
  try {
    await $`bun run docker:test:run`.cwd(path).env(env);
  } finally {
    await $`bun run docker:test:down`.cwd(path).env(env).nothrow().quiet();
  }
}
