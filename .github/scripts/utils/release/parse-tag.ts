import type { ReleaseTag } from "../../types/release-tag";
import { CiError } from "../github/ci-error";

// NOTE: the rules are in .agents/rules/git/releases.md. Final: <app>-vX.Y.Z from main. Release candidate: <app>-vX.Y.Z-rcN from staging.
const TAG_PATTERN = /^([a-z0-9]+(?:-[a-z0-9]+)*)-v(\d+\.\d+\.\d+(-rc\d+)?)$/;

/**
 * Parses a release tag into the app, the version, the environment and the trunk it must come from.
 *
 * @param tag - The tag, e.g. `web-v1.2.3` or `web-v1.2.3-rc1`.
 * @throws {CiError} When the tag does not match the pattern.
 */
export function parseTag(tag: string): ReleaseTag {
  const match = TAG_PATTERN.exec(tag);
  if (!match) {
    throw new CiError(
      `Tag '${tag}' is not valid. Expected <app>-v<major>.<minor>.<patch> or <app>-v<major>.<minor>.<patch>-rc<n>.`,
    );
  }
  const isRc = !!match[3];
  return {
    app: match[1] as string,
    version: match[2] as string,
    isRc,
    environment: isRc ? "staging" : "production",
    branch: isRc ? "staging" : "main",
  };
}
