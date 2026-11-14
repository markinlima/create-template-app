# `@shared/env` – AI Instructions

## What it is

Zod schemas that describe and validate the environment variables of each
runtime (backend packages, workers, web). It exports **schemas only** —
each consumer parses its own `process.env` / `import.meta.env`, usually in
a small `env` module of its own.

## Main technologies

- **Zod** (v4 API: `z.url()`, `z.email()`), **TypeScript** (strict)
- Helpers from `@shared/utils` (string sanitizers)

## Useful scripts

Run from inside `packages/shared/env`.

| Script       | What it does                                                              |
| ------------ | ------------------------------------------------------------------------- |
| `lint`       | Type-check + Biome check; run after every change                          |
| `ts:check`   | `bun check`                                                               |
| `lint:fix`   | Biome check with automatic fixes                                          |
| `test`       | Unit tests (via the shared `@shared/utils/test` script); also `test:unit` |
| `test:watch` | Unit tests in watch mode                                                  |

## Exports

The package export is a wildcard: `@shared/env/<folder>` resolves to that
folder's index.

| Import path           | What it provides                                                                                                                  |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `@shared/env/backend` | `backendEnvSchema`, `databaseEnvSchema`, `storageEnvSchema` (S3 connection, for apps that use `s3mock` locally)                   |
| `@shared/env/web`     | `webEnvSource` (the source of truth), `buildEnvSchema`, `clientEnvSchema`, `serverEnvSchema`, `sentryEnvSchema`, `umamiEnvSchema` |
| `@shared/env/utils`   | `formatEnvVariables`                                                                                                              |

## Usage

```ts
import { databaseEnvSchema } from "@shared/env/backend";
export const env = databaseEnvSchema.parse(process.env);
```

Consumers: the backend app parses `backendEnvSchema` in its `src/env.ts`. Web parses
`clientEnvSchema` against `import.meta.env` in the browser, `serverEnvSchema`
(the public ones only) for the server bundle, and `buildEnvSchema` (every
variable) against the loaded `.env` files in the Vite config. Look at the `env` modules in those workspaces. Mobile
does not use this package.

## Structure (`src/`)

- `backend` — one file per concern (database, storage) plus `backend`,
  which composes the API schema with the database.
- `web` — `source.ts` is the source of truth: every variable of the app, with
  the Sentry and Umami schemas of `components/` extended into it. The profiles
  are at the root: `build.ts` gets everything, `client.ts` and `server.ts` pick
  the `VITE_` variables by hand (`.pick`). When a `VITE_` variable is added, add
  it to both picks too: a test fails if they differ from the source.
- `utils` — `formatEnvVariables` and the `nodeEnv` helper.

## Conventions

- Every exported schema is wrapped with
  `z.preprocess(formatEnvVariables, schema)`. The formatter turns empty
  strings into `undefined`, trims strings and converts `"true"`/`"false"`
  strings to booleans — so declare flags as `z.boolean()` (not coerce)
  and rely on `.default(...)` for missing/empty values.
- Compose schemas with `.and(...)` and `.pick(...)`; a feature schema
  (e.g. the compressor) reuses the smaller ones (queue, storage,
  opentelemetry). Keep each schema to what that runtime really reads, so
  a worker is not forced to define unrelated variables.
- JSON-valued variables are parsed with `transform(JSON.parse).pipe(...)`.
- `NODE_ENV` comes from the `nodeEnv()` helper (defaults to `production`).
- Variable names are SCREAMING_SNAKE_CASE; user-facing text does not
  apply here, comments are in English.

## Adding an environment variable

1. Add it to the schema of the concern it belongs to (or create a new
   file and export it from the folder's index).
2. If a composed schema already includes that concern, it is picked up
   automatically; otherwise `.and()` it in.
3. Update the `.env.example` (and `.env.test` where relevant) of every
   workspace that consumes the schema, plus any deploy/compose config.
   Never read real `.env` files.
4. Run `bun run lint` here and `ts:check` in the consuming workspaces.

## Gotchas

- Schemas run at startup of the consumer; a missing required variable
  throws there. Optional integrations (Sentry) are `.optional()`.
- Blank values are treated as not set: `formatEnvVariables` trims first and
  then turns empty strings into `undefined`, so `"  "` doesn't satisfy a
  required variable.

## Testing

- Unit tests live in `test`, one spec per schema (`test/backend`,
  `test/web`) plus the sanitizer (`test/utils`), named
  `*.unit.spec.ts` and run with Bun.
- Specs call `safeParse` through the `failedKeys` helper, which returns the
  failed variable names, and build inputs from the minimal valid
  environments in the fixtures file (spread and override one variable).
- When adding a variable or rule, cover: required/optional, format
  (URL, email, enum), defaults, coercion/parsing, and any environment-
  dependent rule (e.g. production-only requirements).
