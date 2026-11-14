---

name: release
description: Create a GitHub release (final from main, or release candidate from staging) for one app of the monorepo, following this repo's releases.md — verify the branch and that every check of the pull request that merged its latest commit is green, compute the <projectId>-vX.Y.Z[-rcN] tag, ask for the app, version and kind when unspecified, confirm with a final yes/no question, then publish it. Use only when the user explicitly asks to create/cut/publish a release or release candidate.
user-invocable: true
allowed-tools:

- Bash(git*)
- Bash(curl*)
- Bash(jq*)
- Read

---

# /release — cut a release or release candidate

Creates the GitHub release that triggers the release workflow (tests,
image build, deploy) for one app. Follows
[`releases.md`](../../rules/git/releases.md) and
[`branch-workflow.md`](../../rules/git/branch-workflow.md). **A release
publishes and deploys**, so this skill runs only when the user explicitly
asks for it and always asks a final yes/no confirmation right before publishing.

This skill never commits, merges or pushes code. If the code isn't on the
right trunk yet, point the user at the `commit` / `open-pr` skills.

## 1. Pick the app, the version and the kind

Three inputs are needed: **app**, **version** and **kind** (RC or final).
Whatever the user didn't state clearly, **ask** with `AskUserQuestion`
(one question per missing item, offering the likely options) — never infer
or default it. If the user stated all three clearly, don't ask again.

1. **App**: the `projectId` is the `name` in the app's `package.json`
   (offer the apps that have an entry in the release config file in the
   `.github` folder). It must have an entry there; if it has none, or the
   entry still contains a `REPLACE_ME` placeholder, stop and tell the
   user — the pipeline would reject the tag anyway.
2. **Kind**: final release or release candidate (RC).
3. **Version** (`X.Y.Z`): ask which one. Offer options computed in step 4
   (next patch/minor/major from the latest tag, or the version of the
   latest RC when promoting it to final).

| Kind  | Branch    | GitHub release                   | Tag                      |
| ----- | --------- | -------------------------------- | ------------------------ |
| Final | `main`    | Release (`prerelease: false`)    | `<projectId>-vX.Y.Z`     |
| RC    | `staging` | Pre-release (`prerelease: true`) | `<projectId>-vX.Y.Z-rcN` |

## 2. Verify the source branch

1. `git fetch origin --tags`.
2. The release is created from the **remote** `origin/main` (final) or
   `origin/staging` (RC) — never `dev`, a feature/fix/chore/claude branch or
   any other ref. The local checkout doesn't matter; the release targets the
   remote branch.
3. If the branch the user needs doesn't exist (e.g. no `staging` for an RC),
   stop and tell them.
4. Warn if the app has nothing new since its last tag on that branch:
   `git log <last-tag>..origin/<branch> --oneline -- <app-path>` (include
   the workspaces it depends on when obvious). Ask whether to proceed
   anyway.

## 3. Verify the checks are green

`main` and `staging` get no push run (the pull request already tested the
merge result), so the checks to read are the ones of the **pull request that
merged the latest commit** of `origin/<branch>`, at its head commit:

```bash
SHA=$(git rev-parse origin/<branch>)
# the pull request(s) of the commit; take the merged one whose base is <branch>
curl -sS -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$OWNER_REPO/commits/$SHA/pulls"
# then the checks of that pull request's head commit
curl -sS -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$OWNER_REPO/commits/$HEAD_SHA/check-runs?per_page=100"
```

- The commit must have a **merged** pull request whose base is `<branch>`.
  If it has none (a direct push), **do not create the release** and tell
  the user.
- Every check run of the pull request's head commit must be `completed` with
  conclusion `success` (or `skipped`/`neutral`). Also read
  `.../commits/$HEAD_SHA/status` for legacy statuses.
- If any is failing, pending, or there are **no checks at all**, **do not
  create the release**. Report which ones and stop — fix, or wait and run
  the skill again. Don't offer to bypass this.
- In step 5, report the pull request (number) and its head commit next to
  the released `$SHA`.

Getting `$TOKEN` and `$OWNER_REPO` (`gh` isn't installed in this repo's
devcontainers): feed `protocol=https`, `host=github.com` and a blank line to
`git credential fill` and read the `password=` line; derive `owner/repo`
from `git remote get-url origin`. Never print the token.

## 4. Compute the tag

1. List the app's existing tags: `git tag -l '<projectId>-v*' --sort=-v:refname`
   (and check the remote too, `git ls-remote --tags origin '<projectId>-v*'`).
2. The version is **not** read from `package.json` (each app is versioned on
   its own through its tags, which can be ahead of the file). Base it on
   the latest tag:
   - **RC**: if there are RCs of the next target version, increment `N`
     (`-rc1` → `-rc2`); otherwise start at `-rc1` of the target version.
   - **Final**: normally the version of the latest RC being promoted
     (`web-v1.1.0-rc3` → `web-v1.1.0`), without `-rcN`.
   - **Target version** (`X.Y.Z`): the user decides — it's a business
     decision (ask the user; it is not decided by the agent).
     If they didn't give it, ask in step 1, recommending one based on the
     conventional commits since the last tag (`feat` → minor, `fix` →
     patch, `!`/`BREAKING CHANGE` → major). Only the `-rcN` number is
     computed automatically.
3. Validate it against the pipeline pattern before going further:
   `^[a-z0-9]+(-[a-z0-9]+)*-v[0-9]+\.[0-9]+\.[0-9]+(-rc[0-9]+)?$`. `-rcN` is
   mandatory for an RC and forbidden for a final release (never a final tag
   on `staging`, never an `-rcN` tag on `main`). The tag must not already
   exist.

## 5. Confirm with a yes/no question

Always finish the preparation with a final confirmation via
`AskUserQuestion`, with exactly two options: **Sim** (recommended) and
**Não**. This happens every time, even if the user gave every input in
their first message. The question text must carry the data collected:

- app (`projectId`), kind (RC or final) and the final tag;
- source branch and the commit SHA being released;
- the pull request that merged it and its checks result (all green);
- environment that will receive the deploy (staging for RC, production for
  final) and the number of commits since the last tag (list them just
  above the question).

Example: "Criar a release `web-v1.1.0-rc1` (RC, a partir de `staging` @
`abc1234`, checks verdes, deploy em staging)?"

Publish only on **Sim**. On **Não**, stop and ask what should change
(app, version or kind), then redo from step 1; don't publish anything.

## 6. Publish

Create the release through the REST API; this creates the tag on the
target commit and publishes the release in one step, which starts the
workflow.

```bash
jq -n --arg tag "$TAG" --arg sha "$SHA" --arg name "$TAG" --arg body "$NOTES" --argjson pre "$IS_RC" \
  '{tag_name:$tag, target_commitish:$sha, name:$name, body:$body, prerelease:$pre, draft:false, generate_release_notes:false}' \
  | curl -sS -X POST \
      -H "Authorization: Bearer $TOKEN" \
      -H "Accept: application/vnd.github+json" \
      "https://api.github.com/repos/$OWNER_REPO/releases" -d @-
```

- `target_commitish` is the verified **SHA**, not the branch name, so what
  is released is exactly what was checked.
- `prerelease` is `true` for an RC and `false` for a final release.
- Build `$NOTES` (English) from the conventional commits since the last tag,
  grouped by type; don't invent issue references.
- Never use `--force`/overwrite or delete an existing tag or release. If the
  API returns a `message` error, surface it and stop.

## 7. Report back

The release URL (`.html_url`), the tag, the commit SHA, and that the
release workflow (tests → build → deploy to staging/production, which may
wait on required reviewers of the GitHub environment) has been started.
Don't claim the deploy succeeded — only that it was triggered.

## Don'ts

- Don't create a release without the user explicitly asking, or without the
  yes/no confirmation in step 5.
- Don't release from any branch other than `main` (final) or `staging` (RC).
- Don't release while the checks of the pull request that reached the branch are failing, pending or missing.
- Don't mix a final tag with `staging` or an `-rcN` tag with `main`.
- Don't assume the app, version or kind when the user didn't state them clearly — ask;
  don't pick the version bump silently; don't edit `package.json` versions
  as part of this skill.
- Don't run the release for several apps in one go without asking for each
  tag's approval.
