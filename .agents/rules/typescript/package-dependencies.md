# Package dependencies

Workspaces are grouped by scope, and imports follow one direction. Check the
current imports before changing a rule here, and keep the rule true.

- **`@shared/*`** (`packages/shared`): usable by every runtime, including the
  frontends. May import only other `@shared/*` packages. Never `@backend/*` or
  `@web/*`.
- **`@backend/*`** (`packages/backend`): server-only (database, queue, storage,
  and similar). May import `@shared/*` and other `@backend/*` packages. Never
  `@web/*`.
- **`@web/*`** (`packages/web`): frontend-only libraries. May import `@shared/*`
  and other `@web/*` packages. Never `@backend/*`.
- **`apps/web`**: may import `@shared/*` and `@web/*`. Never `@backend/*` or
  code from `apps/backend`. It reaches the backend only over HTTP.
- **`apps/backend`**: may import `@shared/*` and `@backend/*`. Never `@web/*`.
- **No cycles**: a package must not depend, directly or transitively, on a
  workspace that depends on it. Packages with no internal imports stay leaves.
- **Apps never import each other.** To share code, move it into a package.

## Declare what you import

Every workspace import must be declared in that workspace's own
`package.json` as `workspace:*`. An undeclared import can work locally, through
hoisting, and still break when the workspace is installed or built on its own.

## Adding a new workspace

When a new package or app is added, pick its scope from the table above before
writing any import. If the code needs something from a scope the table forbids,
stop and ask: the fix is usually moving the code to the right scope, which is a
design decision.
