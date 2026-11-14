---

name: open-pr
description: Push the current branch and open a pull request targeting the correct trunk per this repo's branch-workflow.md — a feature/fix/chore/claude branch targets dev, and dev/staging get promoted to the next trunk in order (dev -> staging -> main, or dev -> main when staging doesn't exist). Use when the user asks to open a PR, submit changes for review, or promote dev/staging to the next stage.
user-invocable: true
allowed-tools:

- Bash(git*)
- Read

---

# /open-pr — push and open the right pull request

Decides which trunk the current branch's PR should target — following
[`branch-workflow.md`](../../rules/git/branch-workflow.md) — pushes the
branch, and opens the PR. This skill never commits on your behalf; if
there are uncommitted changes, stop and point the user at the `commit`
skill first.

## 1. Figure out where you are

1. `git status` — must be clean (no uncommitted changes) and up to date
   with what you intend to submit. If it isn't, stop: don't open a PR with
   uncommitted work silently left behind, and don't commit it yourself —
   that's the `commit` skill's job.
2. `git branch --show-current`.
3. `git branch -a` / `git ls-remote --heads origin` — confirm which trunks
   actually exist. `staging` is optional per `branch-workflow.md`; don't
   assume it exists without checking.
4. `git log <target>..HEAD --oneline` once you know the target (step 2
   below) — this is what the PR is actually shipping; read every commit in
   it, not just the branch name, before writing the PR body.

## 2. Pick the target branch

| current branch                                                             | target                                                          |
| -------------------------------------------------------------------------- | --------------------------------------------------------------- |
| any non-trunk branch (`feat(web)/…`, `fix(backend)/…`, `chore(repo)/…`, …) | `dev`                                                           |
| `dev`                                                                      | `staging` if it exists, else `main`                             |
| `staging`                                                                  | `main`                                                          |
| `main`                                                                     | nothing to do — this is the final trunk; tell the user and stop |

If the current branch _is_ a trunk but isn't `dev`, `staging`, or `main`
(shouldn't happen in this repo), stop and ask rather than guessing a
target.

## 3. Guardrails

- Never push to `main`, `staging`, or `dev` directly — this skill only ever
  pushes the _source_ branch (the one being merged **from**), never
  commits to the target directly. Opening a PR into a trunk is the
  approved way to reach it.
- Never open a PR from a feature/fix/chore/claude branch straight to
  `staging` or `main` — it must go to `dev` first, even if the user is in a
  hurry. The one exception is a `hotfix` branch, per `branch-workflow.md`.
- Don't force-push. If the branch needs updating against its base, merge
  (don't rebase) unless the user explicitly asks for a rebase on a branch
  they confirm is safe to rewrite.
- Don't fabricate a ticket/issue reference in the PR body that wasn't
  established in the conversation or commit history.

## 4. Push

`git push -u origin <current-branch>` (retry on network failure per this
session's normal git-push conventions; never retry past that into
force-push territory).

## 5. Open the PR

Don't rely on the `gh` CLI — it isn't installed by default in this repo's
devcontainers. In a cloud session, use the GitHub MCP tools if available.
Locally, open the PR straight against GitHub's REST API using the same
credential `git push` (step 4) already resolved:

1. Get the token: `git credential fill` (feed it `protocol=https`,
   `host=github.com`, blank line to end stdin) and read the `password=`
   line back out — that's git's own stored credential, no separate GitHub
   token setup needed.
2. Derive `owner/repo` from `git remote get-url origin`.
3. Build the payload with `jq -n` (never hand-interpolate title/body into
   a raw JSON string — multi-line bodies and quotes will break it) and
   POST it:

   ```bash
   jq -n --arg title "$TITLE" --arg body "$BODY" --arg head "$HEAD" --arg base "$BASE" \
     '{title:$title, body:$body, head:$head, base:$base}' \
     | curl -sS -X POST \
         -H "Authorization: Bearer $TOKEN" \
         -H "Accept: application/vnd.github+json" \
         "https://api.github.com/repos/$OWNER_REPO/pulls" \
         -d @-
   ```
4. Read `.html_url` off the JSON response for the PR link to report back
   in step 6. If the response has a `message` field instead (error, e.g.
   insufficient token scope), stop and surface it rather than guessing.

Otherwise, follow this session's standing instructions for PR creation
(template discovery, attribution footer, etc.) exactly as you would for
any other PR; this skill only adds the _target-branch_ decision from
step 2 on top of that.

Title and body differ by kind of PR:

- **Feature/fix/chore/claude branch → `dev`**: title summarizes the
  branch's actual change (not the branch name verbatim); body follows
  whatever PR template the repo defines, populated from the branch's
  commits, or a plain summary + test plan if there's no template.
- **Promotion PR** (`dev` → `staging`, `dev`/`staging` → `main`): title
  should read as a promotion, e.g. `chore(release): promote dev to
  staging`; body lists what's being promoted (the commit range from step
  1.4) rather than re-describing each change in detail — the individual
  PRs that landed on the source trunk already carry that detail.

## 6. Report back

The PR URL, its target branch, and — for a promotion PR — the commit range
it carries. If step 1 stopped you on uncommitted changes or step 2 stopped
you on `main`, say that instead and don't proceed further.
