import { group } from "../github/group";
import { runSuite } from "./run-suite";

export interface RunSuitesOptions {
  /** Name of the app, for the error annotations. */
  app: string;
  /** Folder of the app. */
  path: string;
  suites: string[];
}

/**
 * Runs every suite, even after one fails, so a single run reports all of them.
 *
 * @param options - See {@link RunSuitesOptions}.
 * @returns The suites that failed, empty when all passed.
 */
export async function runSuites(options: RunSuitesOptions) {
  const failed: string[] = [];
  for (const suite of options.suites) {
    await group(`Run ${suite} tests`, async () => {
      try {
        await runSuite(options.path, suite);
      } catch {
        failed.push(suite);
        console.log(`::error::The ${suite} tests of ${options.app} failed.`);
      }
    });
  }
  return failed;
}
