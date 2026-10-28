---
name: commit
description: Create a git commit in this repo — ask for explicit approval before every commit, split changes into small atomic layered commits, follow the message format, and add a Co-Authored-By trailer only when the AI agent actually touched a committed file. Use when asked to commit changes, stage files, or create a git commit.
---

# Commit

- **Never commit without explicit approval, every time.** When a task is
  finished — fully implemented, lint clean, tests green — the agent must
  proactively ask the user whether it can commit; don't just report
  completion and wait silently. Approval for one commit/batch is not
  blanket approval for later ones in the same session — ask again each
  time.
- **Split work into small, atomic, layered commits per logical concern**,
  not one commit per feature/increment. Typical order for a single
  feature increment: contract/schema layer, implementation, tests, docs.
  Stage only the files that belong to each commit — never `git add -A`
  or `git add .`.
- **Commit message format**: see
  [`.agents/rules/commit.md`](../../rules/commit.md) for the message
  format (Conventional Commits, title + description, categorized
  bullets).
- **`Co-Authored-By` trailer is conditional, not automatic.** Only add it
  if at least one file being committed was actually touched (written or
  edited) by the AI agent in this session, and that file can't be split
  out of the commit (e.g. it's a user-edited file that depends on a
  change the agent made). If every file in the commit was edited by the
  user themselves — e.g. the user asks the agent to commit changes they
  made on their own — omit the trailer entirely.
  - When it applies, name the model **actually in use for the current
    session** — never hardcode a specific model name (e.g. don't always
    write "Claude Sonnet 5"; if the session is running Opus, Haiku, or a
    future model, use that name instead):
    ```
    Co-Authored-By: <current model name> <noreply@anthropic.com>
    ```
