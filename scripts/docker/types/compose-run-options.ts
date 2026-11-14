/** Options of `runCompose`. */
export interface ComposeRunOptions {
  /** The arguments after `docker compose` and the flags below, e.g. `["up", "-d"]`. */
  args: string[];
  /** The directory the command runs in. */
  cwd: string;
  /** A compose file for `-f`; without it, Compose reads the `docker-compose.yml` of `cwd`. */
  file?: string;
  /**
   * The Compose profiles to turn on (each one becomes `--profile`).
   * @defaultValue []
   */
  profiles?: string[];
  /**
   * Envs added to the ones of this process (they fill the `${VAR}` of the compose files).
   * @defaultValue {}
   */
  env?: Record<string, string>;
  /**
   * Hide the output of the command, which comes back in the result instead of going to the terminal.
   * @defaultValue false
   */
  quiet?: boolean;
}
