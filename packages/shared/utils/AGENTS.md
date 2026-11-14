# `@shared/utils` – AI Instructions

## What it is

Small, generic, domain-free helpers shared by every app, worker and package: array/string utilities, Zod preprocessing helpers, mention parsing, image-size math, type-level helpers, and a test-support export (test-script runner, `waitFor`).

## Main technologies

- **TypeScript** (strict), **Zod 4**, **Bun** (including `bun test`), **Biome**.

## Useful scripts

Run from inside `packages/shared/utils`:

| Script               | What it does                                                |
| -------------------- | ----------------------------------------------------------- |
| `test` / `test:unit` | Run unit tests (`*.unit.spec.*`) via the test script runner |
| `test:watch`         | Unit tests in watch mode                                    |
| `lint`               | Type-check + Biome check; run after every change            |
| `ts:check`           | `bun check`                                                 |
| `lint:fix`           | Biome check with automatic fixes                            |

## Exports

| Import path          | What it contains                                                                                                                                                                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@shared/utils`      | Runtime helpers: batching, de-duplication, truncation, random pick/`maybe`, resize math, mention extraction/parsing, and Zod helpers for string-to-boolean, trimming strings and empty-strings-to-undefined. Look at the barrel in `src` for the full list. |
| `@shared/utils/ts`   | Type-only helpers (`DeepPartial`, `Flatten`, `OptionalFields`, `RequiredFields`).                                                                                                                                                                           |
| `@shared/utils/test` | `createTestScript` (builds the `bun test` runner used by each workspace's `scripts/*.ts`) and `waitFor` (polling helper).                                                                                                                                   |

## Conventions

- One helper per file, kebab-case, re-exported from the folder barrel.
- Follow the repo parameter rules: single value directly; input first plus an exported `options` interface second; several values in one exported options object.
- Helpers must stay generic: no domain knowledge (that belongs in `@shared/core`) and no workspace dependencies.
- Anything exported from the main entry must run in browser, React Native and Bun. Node/Bun-only code (like the test runner) stays under the `test` export.
- Mentions use the `<@uuid>` format (v4/v7 UUIDs).

## Adding things

1. Create the file in `src` (or `src/ts` for types, `src/test` for test support) and export it from that folder's barrel.
2. Add a `<name>.unit.spec.ts` next to it for non-trivial logic.
3. A new subfolder needs an `index.ts` to resolve through the `./*` export.

## Testing

Unit tests live next to the source as `<name>.unit.spec.ts` and run with `bun test` through the package script. `createTestScript` maps positional args to `<name>.<type>.spec` patterns (so `bun run test:unit mentions` runs matching specs), forwards other flags to `bun test`, and sets `NODE_ENV=test`. Other workspaces reuse it for their integration/e2e scripts. Import `@shared/utils/test` only from test files and scripts.

## Gotchas

- `waitFor` in its default (non-conditional) mode resolves as soon as the condition does not throw, returning its value as is (even a falsy one such as `0` or `false`); pass `conditional: true` to wait for a truthy value.
- `maybe` and `random` are non-deterministic; use them only in factories/tests.
