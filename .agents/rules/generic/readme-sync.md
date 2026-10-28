# Keep README.md, AGENTS.md and CLAUDE.md in sync with directory changes

Every directory can carry up to three documentation files that describe it:

- `README.md`
- `AGENTS.md`
- `CLAUDE.md` (a thin file that imports `AGENTS.md`, see below)

Whenever you create, edit, rename, move, or delete a file inside a directory
that contains any of these (or a subdirectory of one, when that doc
documents the subtree — e.g. a module's `README.md` describing its
variables, outputs, or nested resources), check whether they are still
accurate before finishing the task, and update every one that exists.

This matters because these files are the reference other people — and
other AI sessions — rely on to use the module correctly without re-reading
every `.tf`/compose file. A stale doc (wrong variable name, missing new
input, outdated example, obsolete architecture description) actively misleads
future usage.

## Same content across all of them

When more than one of the three exists in a directory, they must always
carry the same content. Never update one and leave the others behind.

- `README.md` and `AGENTS.md`: keep the documented content identical.
  Whatever you add, change, or remove in one, apply to the other in the
  same change. When a section would be the same in both, don't copy it:
  keep it in one file and have the other one link to it (usually the
  README links to the `AGENTS.md` section).
- `CLAUDE.md`: it is only the one-line import `@AGENTS.md`, so it already
  mirrors `AGENTS.md` automatically. Never put content in it. If it has
  drifted from that single line, restore it.
- Only sync the files that exist. Don't create a missing `README.md`,
  `AGENTS.md`, or `CLAUDE.md` just to have all three, unless the user asks
  (or another rule requires it, e.g. every location needing an `AGENTS.md`).
- If the existing files already disagree with each other, don't pick a
  winner silently: reconcile them using what the code actually does, and
  tell the user what differed.

## What to check

After making the change, compare each doc against the current state of the
directory:

- **Usage examples** (`## Usage` blocks, HCL/YAML snippets) — do they still
  match the actual variable names, types, defaults, and required inputs?
- **Variable/output tables or descriptions** — new variables added, removed,
  or renamed; changed defaults or `@options` values.
- **Structural/architectural description** — do they still describe the
  right files, resources, or flow (e.g. "creates a project, an
  environment, a compose stack...")? Update them if the change adds/removes
  a resource or alters behavior they document.
- **Cross-references** — links to sibling modules (e.g. "Sibling of
  `dokploy/application/swarm`") that may need updating if the module was
  moved, renamed, or split.

## What to do

- If the docs are still accurate and in sync, do nothing — don't touch them
  just to touch them.
- If they're outdated or out of sync, update all of them as part of the same
  change (don't leave it as a follow-up) and mention in your summary to the
  user which files were updated and why.
- If you're unsure whether a described behavior is still correct (e.g. the
  change is ambiguous or you can't verify it from the code alone), say so
  explicitly to the user instead of guessing at the content.
- Never invent documentation for behavior you didn't verify in the code —
  only document what the change actually does.
