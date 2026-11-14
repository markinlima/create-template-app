# Libraries in the web libraries

This rule is for the browser projects (`apps/web`) and the libs in `packages/web/`. It is not a repo-wide rule: the
backend, the mobile app and the other packages have their own habits.

The libs in `packages/web/` exist to take a piece of code, make it reusable and use it in several projects. They are meant to be
read, maintained and updated by the owner, so what matters is that a lib is **easy to read and to maintain**, not that it has no
dependencies.

## What a lib may use

- **Libraries the project already uses are fine, and preferred over writing the same thing by hand.** Zustand for state, Zod for
  validation and parsing, Immer for cache patches, TanStack Query and the like: use them in a package when they make it simpler,
  instead of rebuilding a smaller version. A hand-made store or a manual `typeof` check that Zod or Zustand would replace is more
  code to read and to keep.
- Declare every dependency in the lib's own `package.json`, follow the
  [dependency catalog](../../typescript/dependency-catalog.md) (a library used by more than one workspace goes in the root catalog), and run
  `bun install` at the root.

## Adding a library the project does not use yet

Don't add it on your own. When something would cost a lot to write alone (a parser, a date or diff algorithm, a complex widget),
**ask the user first**, with:

- the name, what it would do in the package and why writing it by hand is not worth it;
- the evidence that it passes the bar below, checked and not assumed (the registry and the repository).

A new library has to be:

- **well known**: widely used, with a track record;
- **maintained**: recent releases and issues that get answered;
- **a good fit**: small enough for the job, with types, and not pulling a large tree of its own.

If it fails any of these, write the code instead, or ask again with the alternatives.

## Don'ts

- Don't write a smaller copy of a library the project already has.
- Don't add a library to save a few lines.
- Don't add one without asking, however popular it is.
