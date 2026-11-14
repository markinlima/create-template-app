/**
 * URL of the linux amd64 Phase CLI binary of a version.
 *
 * @param version - Version without the `v` prefix, e.g. `2.3.2`.
 */
export function phaseDownloadUrl(version: string) {
  return `https://github.com/phasehq/cli/releases/download/v${version}/phase_cli_${version}_linux_amd64`;
}
