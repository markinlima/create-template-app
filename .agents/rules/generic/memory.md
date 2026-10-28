# Memory

Distinguish between two kinds of "memory" an AI agent might keep:

- **Session/assistant-local memory** (e.g. a coding assistant's own
  private, per-user memory store) — fine for things that only matter to
  how that specific assistant collaborates with a specific user
  (communication style, workflow habits, etc).
- **Repository knowledge** — conventions, decisions, or context that
  apply to this project regardless of who works on it or which AI tool
  they use. This must be committed to the repo itself, not left in a
  private/session-only memory store, so any future session — and any
  human or AI collaborator — can access it.

## Where to save it

When something you learn falls into the second category (a convention,
a decision and its reasoning, a gotcha, a past mistake worth remembering),
write it as a markdown file under `.agents/memory/<topic>.md`, placed at
the level closest to where it's relevant:

- Repo-wide conventions/decisions → `.agents/memory/<topic>.md` at the
  repo root.
- Scoped to one app/package → `<path-to-app-or-package>/.agents/memory/<topic>.md`
  (e.g. `templates/web/spa/.agents/memory/<topic>.md`).

Keep each file focused on one topic; don't dump unrelated notes into a
single catch-all file. Write in English, per
[`.agents/rules/language.md`](./language.md).

## Point agents at it

After adding a memory file, update the nearest `AGENTS.md` (the one at
the same level, or the closest ancestor) to mention `.agents/memory/` so
agents know to check it before starting work in that location — see the
root [AGENTS.md](../../../AGENTS.md#memory) for the wording to mirror.

## `.claude/` mirroring

Like `.agents/rules/` and `.agents/skills/`, `.agents/memory/` is mirrored
into `.claude/` the same way: a symlink at the repo root
(`.claude/memory -> ../.agents/memory`), and automatically covered
everywhere else since `.claude/` itself is a symlink to `.agents/` in
every non-root location.
