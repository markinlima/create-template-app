/** An app whose Docker test stack runs in one job of the test matrix. */
export interface AppTarget {
  name: string;
  path: string;
  /** Comma-separated suites to run, each one a `test:<suite>` script of the app. */
  suites: string;
}
