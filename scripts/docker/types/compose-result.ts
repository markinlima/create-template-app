/** What `runCompose` gives back. */
export interface ComposeResult {
  exitCode: number;
  /** The error output; empty when the command was not quiet, because it went to the terminal. */
  stderr: string;
}
