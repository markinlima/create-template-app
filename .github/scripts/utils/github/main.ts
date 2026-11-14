import { CiError } from "./ci-error";

/**
 * Runs the body of a script entry point. A {@link CiError} becomes an `::error::` annotation and exit code 1.
 *
 * @param run - The script body.
 */
export async function main(run: () => Promise<void>) {
  try {
    await run();
  } catch (error) {
    if (error instanceof CiError) {
      console.log(`::error::${error.message}`);
      process.exit(1);
    }
    throw error;
  }
}
