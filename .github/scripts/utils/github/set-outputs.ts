import { appendGithubFile } from "./append-github-file";

/** Sets step outputs, read by the next steps as `steps.<id>.outputs.<key>`. */
export function setOutputs(values: Record<string, string>) {
  appendGithubFile("GITHUB_OUTPUT", values);
}
