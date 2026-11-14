# `@shared/config` – AI Instructions

## What it is

Shared, non-code tooling configuration for the monorepo. Today it only
ships the base TypeScript config that workspaces extend. It has no source
code, no scripts and no tests.

## Main technologies

- **TypeScript** compiler options (JSON), **Bun** types

## Exports

| Import path                   | What it provides                                                            |
| ----------------------------- | --------------------------------------------------------------------------- |
| `@shared/config/typescript/*` | Any file in the package's `typescript` folder (currently the base tsconfig) |

## Usage

Workspaces add `@shared/config` as a `workspace:*` devDependency and extend
it from their `tsconfig.json`:

```json
{
  "extends": "@shared/config/typescript/base.json",
  "compilerOptions": { "types": ["@types/bun"] }
}
```

The `@shared/*`, `@backend/*` packages, the backend app and the workers
follow this pattern; look at their tsconfig files for examples.

## The base config

Strict mode with `noUncheckedIndexedAccess`, `verbatimModuleSyntax`,
bundler module resolution and `noEmit`. Open the folder to see the exact
options. Notable: unused locals/params are NOT errors.

## Conventions and gotchas

- Changing the base config affects every workspace that extends it — run
  `bun run ts:check` at the repo root afterwards.
- Per-workspace needs (JSX, path aliases, DOM libs, `types`) belong in the
  workspace's own tsconfig, not in the base.
- To add another preset, drop a JSON file in the `typescript` folder; it
  is exported automatically through the wildcard.
- The web and mobile apps intentionally do not extend this package: each
  has its own, distinct TypeScript configuration. Don't make them extend
  the base.
- This package has no lint/test scripts; Turborepo skips it for those tasks.
