# Git branch names

Whenever you create a git branch in this repo, follow
[Conventional Branch v1.1.0](https://conventionalbranch.org/). This mirrors
[commits.md](./commits.md) but for branch names instead of commit messages —
both always use plain ASCII, regardless of the language the conversation is
in.

## Format

```
<type>/<description>
```

Trunk branches (`main`, `master`, `develop`) never get a prefix — this repo's
trunk is `main`. Every other branch is `<type>/<description>`, all lowercase.

## Types

Purpose prefixes (pick the one matching what the branch does, same intent as
the Conventional Commits `type` in [commits.md](./commits.md)):

| type       | when to use                                              |
|------------|-----------------------------------------------------------|
| `feature`/`feat` | a new feature (new app/service, new module, new input) |
| `bugfix`/`fix`   | a bug fix                                          |
| `hotfix`   | an urgent fix, usually pushed straight to production state |
| `release`  | preparing a release (e.g. `release/v1.2.0`)                |
| `chore`    | non-code maintenance: deps, docs, CI, lint config           |

AI agent source prefixes — use one of these instead of a purpose prefix when
the branch is being created by an AI coding agent, naming which one:

| type       | agent                          |
|------------|---------------------------------|
| `claude`   | Claude Code (this session)      |
| `ai`       | generic/unspecified AI agent    |
| `codex`    | OpenAI Codex                    |
| `copilot`  | GitHub Copilot                  |
| `cursor`   | Cursor                          |

When you (Claude Code) create a branch on your own initiative, prefer
`claude/<description>` over a purpose prefix, unless the user asks you to use
a purpose prefix instead.

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
  tool (e.g. `feature/issue-123-new-login`). Don't invent a ticket number
  that wasn't given.

## Examples

Valid:

```
feature/add-kiaz-portfolio-app
fix/dokploy-network-module-path
chore/bump-devcontainer-features
release/v1.2.0
claude/migrate-openbao-to-phase
```

Invalid:

```
Feature/Add-Login          # uppercase
feature/new--login          # consecutive hyphens
feature/-new-login          # leading hyphen
feature/new-login-          # trailing hyphen
fix/header_bug              # underscore
unknown/some-task           # unlisted type
```

## Don'ts

- Don't add a prefix to `main` (this repo's trunk branch).
- Don't use an underscore, space, or camelCase/PascalCase in the description.
- Don't invent a ticket/issue reference that wasn't established in the
  conversation.
- Don't mix a purpose prefix and an AI agent prefix — pick one.
