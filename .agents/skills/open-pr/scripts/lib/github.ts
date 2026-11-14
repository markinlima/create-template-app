import { run } from "./run";

export interface Repo {
  owner: string;
  repo: string;
}

/** `owner/repo` from the address of a remote: `https://github.com/o/r.git`, `git@github.com:o/r.git`, `ssh://git@github.com/o/r`. */
export function parseRemote(url: string): Repo | null {
  const match = url
    .trim()
    .match(/github\.com[:/]+([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?$/);

  return match?.[1] && match[2] ? { owner: match[1], repo: match[2] } : null;
}

/** The token git already uses to push (its credential helper), so there is no other token to set up. It is never printed. */
export function getToken() {
  const result = run(["git", "credential", "fill"], {
    input: "protocol=https\nhost=github.com\n\n",
  });
  const token = result.stdout.match(/^password=(.+)$/m)?.[1];

  if (!token) {
    throw new Error(
      "git has no credential for github.com (run a git push once, or sign in with the credential helper)",
    );
  }

  return token;
}

export interface RequestOptions {
  token: string;
  method?: "GET" | "POST";
  path: string;
  body?: unknown;
}

/** One call to the REST API of GitHub, giving back the status and the JSON. */
export async function githubRequest({
  token,
  method = "GET",
  path,
  body,
}: RequestOptions) {
  const response = await fetch(`https://api.github.com${path}`, {
    method,
    // ? A repository can set `loglevel = "debug"` in its bunfig, which makes `fetch` print every request: this one stays quiet.
    verbose: false,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return {
    status: response.status,
    json: (await response.json().catch(() => ({}))) as Record<string, unknown>,
  };
}
