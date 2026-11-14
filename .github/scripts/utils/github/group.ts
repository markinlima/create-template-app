/** Runs a step inside a collapsible log group of the workflow output. */
export function group<T>(title: string, run: () => Promise<T>) {
  console.log(`::group::${title}`);
  return run().finally(() => console.log("::endgroup::"));
}
