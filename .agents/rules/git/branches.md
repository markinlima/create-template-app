# Git branch names

Whenever you create a git branch in this repo, follow
[Conventional Branch v1.1.0](https://conventionalbranch.org/). This mirrors
[commits.md](./commits.md) but for branch names instead of commit messages —
both always use plain ASCII, regardless of the language the conversation is
in.

## Format

```
<type>(<scope>)/<description>
```

Trunk branches (`main`, `master`, `develop`) never get a prefix — this repo's
trunk is `main`. Every other branch is `<type>(<scope>)/<description>`, all
lowercase.

## Scope (required)

This is a monorepo with many projects, so the branch name always says where the
work happens, the same way the scope of a commit does in
[commits.md](./commits.md). The scope is the app, package, template or area being
changed: `web`, `backend`, `docker`, `ci`, `docs`, the name of a `packages/*`
workspace, or the module inside an app when that is clearer.

- Take it from the directory/module that holds the change. If the work spans
  several projects, use the one that is the main target; use `repo` only when
  it is truly repo-wide (root config, shared rules).
- Never mix scopes with a slash or a comma: one scope per branch.
- A branch without a scope is invalid, even when the type is right.

## Types

Purpose prefixes (pick the one matching what the branch does, same intent as
the Conventional Commits `type` in [commits.md](./commits.md)):

| type             | when to use                                                |
| ---------------- | ---------------------------------------------------------- |
| `feature`/`feat` | a new feature (new app/service, new module, new input)     |
| `bugfix`/`fix`   | a bug fix                                                  |
| `hotfix`         | an urgent fix, usually pushed straight to production state |
| `release`        | preparing a release (e.g. `release/v1.2.0`)                |
| `chore`          | non-code maintenance: deps, docs, CI, lint config          |

AI agent prefixes (`claude`, `ai`, `codex`, `copilot`, `cursor`) are **not
used**: the branch name says what and where, not who wrote it. An AI agent
names its branches like a person does, with a purpose type and a scope. Use an
agent prefix only if the user explicitly asks for it.

## Description rules

- Lowercase letters (`a-z`), digits (`0-9`), and hyphens (`-`) to separate
  words only — no underscores, spaces, or other special characters.
- Dots (`.`) are allowed only for version-style segments (e.g.
  `release/v1.2.0`).
- No leading, trailing, or consecutive hyphens/dots, and a hyphen/dot may
  never sit directly next to another hyphen/dot.
- Keep it descriptive but concise — the reader should know the purpose of
  the work from the branch name alone.
- Include the ticket/issue number when the work is tracked in an external
  tool (e.g. `feat(web)/issue-123-new-login`). Don't invent a ticket number
  that wasn't given.

## Examples

Valid:

```
feat(web)/add-comment-button
fix(web)/removing-wrong-text
chore(backend)/improving-create-post-route
fix(docker)/dokploy-network-module-path
chore(repo)/bump-devcontainer-features
release/v1.2.0
```

Invalid:

```
feat/add-login              # missing scope
Feature(web)/Add-Login      # uppercase
feat(web)/new--login        # consecutive hyphens
feat(web)/-new-login        # leading hyphen
feat(web)/new-login-        # trailing hyphen
fix(web)/header_bug         # underscore
unknown(web)/some-task      # unlisted type
claude/some-task            # agent prefix, no scope
```

## Don'ts

- Don't add a prefix to `main` (this repo's trunk branch).
- Don't use an underscore, space, or camelCase/PascalCase in the description.
- Don't invent a ticket/issue reference that wasn't established in the
  conversation.
- Don't create a branch without a scope, and don't use an AI agent prefix
  (`claude/`, `ai/`, ...) on your own initiative.
