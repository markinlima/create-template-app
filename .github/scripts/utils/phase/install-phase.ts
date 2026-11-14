import { chmod } from "node:fs/promises";
import { join } from "node:path";

import { PHASE_SHA256, PHASE_VERSION } from "../../constants/phase-cli";
import { CiError } from "../github/ci-error";
import { phaseDownloadUrl } from "./phase-download-url";

// NOTE: the CLI is checked against a pinned checksum instead of piping an install script into a shell.

/**
 * Downloads the pinned Phase CLI into a folder and checks its SHA-256 before it is used.
 *
 * @param dir - Folder to write the binary to.
 * @returns The path of the executable.
 * @throws {CiError} When the download fails or the checksum does not match.
 */
export async function installPhase(dir: string) {
  const response = await fetch(phaseDownloadUrl(PHASE_VERSION));
  if (!response.ok) {
    throw new CiError(`Could not download the Phase CLI (${response.status}).`);
  }
  const binary = new Uint8Array(await response.arrayBuffer());
  const digest = new Bun.CryptoHasher("sha256").update(binary).digest("hex");
  if (digest !== PHASE_SHA256) {
    throw new CiError(`The Phase CLI checksum does not match (got ${digest}).`);
  }

  const path = join(dir, "phase");
  await Bun.write(path, binary);
  await chmod(path, 0o755);
  return path;
}
