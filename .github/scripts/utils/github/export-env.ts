import { appendGithubFile } from "./append-github-file";

/** Sets environment variables for the next steps of the same job. */
export function exportEnv(values: Record<string, string>) {
  appendGithubFile("GITHUB_ENV", values);
}
