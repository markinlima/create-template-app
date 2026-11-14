# `@shared/authorization` – AI Instructions

## What it is

The place where "who can do what" is defined for the monorepo, with
[CASL](https://casl.js.org). It builds an ability from a user and exposes
`defineAbilityFor`. The package is an empty engine: it has no subjects and
no roles yet. They are defined per project, when the roles are designed.

## Main technologies

- **CASL** (`@casl/ability`, Mongo-style conditions)
- **Zod** (the action and subject tuples are Zod schemas; types are inferred)
- **TypeScript** (strict), **Bun** test runner

## Useful scripts

Run from inside `packages/shared/authorization`.

| Script       | What it does                                            |
| ------------ | ------------------------------------------------------- |
| `lint`       | Type-check + Biome check; run after every change        |
| `ts:check`   | `bun check`                                             |
| `lint:fix`   | Biome check with automatic fixes                        |
| `test`       | Unit tests (via the shared `@shared/utils/test` script) |
| `test:watch` | Unit tests in watch mode                                |

## Exports

| Import path                  | What it provides                                                                                                            |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `@shared/authorization`      | `configureAbility()` factory                                                                                                |
| `@shared/authorization/core` | `AppAbility`, `AppAbilities`, `appAbilities` (Zod tuples), `createAppAbility`, `DefineAbilityForProps`, `definePermissions` |

## How it is used

```ts
import { configureAbility } from "@shared/authorization";
export const { defineAbilityFor } = configureAbility();

const { can } = defineAbilityFor({ user });
```

- `defineAbilityFor` takes `{ user }` (`UserModel` from `@shared/routes/models`).
- `can`/`cannot` on the returned ability are pre-bound, so they can be destructured.

## Structure (`src/`)

- `core` — the ability type (`MongoAbility<AppAbilities>`), the Zod tuples of
  the actions and subjects, and `definePermissions`, which holds the rules.
- `index.ts` — `configureAbility()`.

## Rule semantics (from `definePermissions`)

- A user with an unverified e-mail gets no permissions (early return).
- Everything else is granted by the rules that a project adds to
  `definePermissions`. Nothing is granted by default.

## Adding permissions (once the roles exist)

1. Add the subject as a Zod tuple (`[action, typename]` or with an object
   shape carrying the fields the rules condition on) and add it to the
   `appAbilities` union in `core/abilities.ts`.
2. Add the `can`/`cannot` rules in `definePermissions`, in order: later rules win in CASL.
3. Add a unit test in `test/core` for each rule and for the unverified-user guard.

## Rules and gotchas

- **Never decide permission rules on your own.** They are business rules:
  ask the user before writing them.
- Do not duplicate permission logic in apps: call the ability from the app.
- When a subject is an object (not a string), `configureAbility` must pass
  `detectSubjectType` to `builder.build()`, reading its typename. It is not
  set yet because no subject exists.

## Testing

- Unit tests live in `test/core`, run with Bun (`bun run test`).
- The current spec covers the unverified-user guard and the empty default.
