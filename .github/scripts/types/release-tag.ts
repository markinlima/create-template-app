import type { Environment } from "./environment";

/** A release tag, parsed into what the release needs. */
export interface ReleaseTag {
  app: string;
  version: string;
  isRc: boolean;
  environment: Environment;
  /** Trunk the tagged commit must be on. */
  branch: "main" | "staging";
}
