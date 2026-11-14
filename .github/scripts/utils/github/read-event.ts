import { readFileSync } from "node:fs";

/** Reads the webhook event that triggered the run. Empty outside GitHub Actions. */
export function readEvent(): Record<string, unknown> {
  const path = process.env.GITHUB_EVENT_PATH;
  if (!path) {
    return {};
  }
  return JSON.parse(readFileSync(path, "utf8"));
}
