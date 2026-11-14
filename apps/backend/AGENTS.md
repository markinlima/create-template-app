# Backend — AI Instructions

## What it is

Template of a REST API with [ElysiaJS](https://elysiajs.com/) on [Bun](https://bun.sh/), [Drizzle ORM](https://orm.drizzle.team/) over Postgres 18 and [Better Auth](https://www.better-auth.com/) for the accounts. It was cut from a real API and reduced to the parts every API has: the OpenAPI abstraction (one contract per operation, shared by the server and the clients), the error shape, the plugins of each request, and the authentication.

The domain of the project (posts, chats, payments...) is not here: a new domain is a new folder in `src/http/routes/` and its contracts in `@shared/routes`.

## Main technologies

| Concern        | Tool                                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------- |
| Framework      | [Elysia](https://elysiajs.com/)                                                                                      |
| Runtime        | [Bun](https://bun.sh/)                                                                                               |
| Validation     | [Zod](https://zod.dev/), in the contracts of `@shared/routes` and the env                                            |
| Database       | [Drizzle ORM](https://orm.drizzle.team/) on Bun's native SQL driver (`drizzle-orm/bun-sql`), schema in `@backend/db` |
| Authentication | [Better Auth](https://www.better-auth.com/) (`src/lib/auth.ts`)                                                      |
| API docs       | `@elysiajs/openapi`, at `/docs` (and `/docs/json`) outside production                                                |
| Lint / format  | [Biome](https://biomejs.dev/)                                                                                        |
| Tests          | Bun's test runner, against a real Postgres for the e2e tests                                                         |

## Rules

Shared with the queue workers. Read them before the change they cover:

- [`streaming-large-payloads.md`](../../.agents/rules/backend/streaming-large-payloads.md) — never buffer an unbounded upload or download in memory.

## Useful scripts

Run from `apps/backend`:

- `bun run dev`: the dev server, with reload.
- `bun run start`: the server in production mode.
- `bun run test:unit`: the unit tests (error handler, plugins); no database needed.
- `bun run test:e2e`: the e2e tests (auth and the OpenAPI document); needs the database of `.env.test` migrated.
- `bun run test:all`: both.
- `bun run db:generate -- <name>`: a new migration after a change in `packages/backend/db/src/schema`.
- `bun run db:migrate`: applies the pending migrations.
- `bun run ts:check`: type-check. `bun run lint`: type-check + Biome, after every change.
- `bun run docker:build`: the production image (from the repo root as context).

## Running it locally

```bash
docker compose up -d                    # Postgres 18 on localhost:5432 (user and database: app)
cp .env.example .env                    # fill BETTER_AUTH_SECRET (at least 32 characters)
bun run db:migrate                      # or RUN_MIGRATIONS=true, applied at start
bun run test:all                        # the suites run against the app_test database
bun run dev
```

`.env.test` is committed on purpose: it has test values only, for the Postgres of `docker-compose.yml`. Bun loads it when `NODE_ENV=test`. In the test environment the e-mail verification code is always `123456`.

## Project structure (`src/`)

- **`env.ts`**: the env, validated with Zod once at startup. A missing or malformed variable stops the process before it listens.
- **`app.ts`**: the app: the error handler, then the plugins every request goes through (CORS, CSRF, OpenAPI), then the routes. It is a plain Elysia instance, so the tests call `app.handle(request)` without a server.
- **`server.ts`**: the entry point. Runs the migrations when `RUN_MIGRATIONS` is on, then listens.
- **`http/plugins/`**: the Elysia plugins.
  - `openapi-plugin.ts`: the OpenAPI document. The Zod schemas are converted with `z.toJSONSchema` (input side), so the document describes what a client sends.
  - `cors-plugin.ts` and `csrf-plugin.ts`: CORS for the origins of `CORS_ORIGIN`, and the rejection of state-changing requests from another browser origin (CORS alone doesn't stop a simple request with a cookie).
  - `model-plugin.ts`: registers the named models (`"ErrorModel"`...) on a route, so its `response` can refer to them by name.
  - `auth-plugin.ts`: reads the session through Better Auth and puts `session` in the handler. It answers 401 without a session, and with `auth.email_not_verified` when the e-mail isn't verified (both can be turned off per route).
- **`http/routes/<domain>/`**: one file per operation, named `<verb>-<resource>.ts` after its `operationId`, and a `routes.ts` that groups the domain. `http/routes/routes.ts` joins the domains.
- **`lib/`**: the external libs' configuration. `auth.ts` is Better Auth; `email.ts` is the placeholder for the e-mail provider.
- **`mappers/`**: the database row → public model. A route never returns a row: it goes through a mapper, so an internal column (a hash, a flag) can't leak.
- **`errors/`**: the errors the app raises on purpose (`AppError` and the HTTP ones). Throwing one stops the flow, and `utils/error-handler.ts` turns it into the response.
- **`utils/`**: the error handler, the default responses and `noResponse()` for the 204 routes.
- **`lang/pt.ts`**: the pt-BR texts of the Better Auth error codes. Everything the user reads is in pt-BR.
- **`types/openapi.d.ts`**: types the `detail` of every route (the tags, the operation id and the `x-*` fields).

Outside the app: `packages/backend/db` (the schema, the client and the migrations) and `packages/shared/routes` (the contracts). The contracts are the wire format: the backend and every client import the same schemas.

## The OpenAPI abstraction

Each operation has three parts that never mix:

1. **Its contract** in `packages/shared/routes/src/routes/api/<domain>/<operation>.ts`: the `Body`/`Query`/`Params` and the `Response` as Zod schemas. Response data is nested under a named property (`{ user }`, `{ items }`), never at the root.
2. **Its handler** in `apps/backend/src/http/routes/<domain>/<operation>.ts`: it imports the contract, wires it in `body`/`response`, and fills the `detail`.
3. **Its models** in `packages/shared/routes/src/models/`: the public shape of an entity, tagged `ref("<Name>")`, and listed in `getModels()` under the same name.

The `detail` of every route has:

- `operationId` and `summary`: `sign-in` and `Sign in`.
- `description`: in English, what the route does, when it is used and any access restriction, in a few words.
- `tags`: one of `openApiTag` (`Auth`, `Health`, `User`...).
- `x-data-shape`: `"dto"` when the response is a model, `"custom"` for another shape, `undefined` when there is no body.
- `x-pagination-type`: `"none"` for a single item or an action, `"full"`, `"cursor"` or `"page"` for lists, `undefined` for a 204.
- `x-cache-entity`: the tag of the entity the frontend must refresh in its cache (`"User"` for the accounts), `undefined` when there is none.

The `x-*` fields are typed in `src/types/openapi.d.ts`: a route with a wrong value doesn't compile.

## Authentication

Better Auth keeps the sessions in the database: the browser holds an httpOnly cookie with the token, and `authPlugin` reads it on each request.

- **Sign-up** creates an unverified account and does not sign in (`autoSignIn: false`). The client then asks for the code (`request-email-verification`) and sends it back (`verify-email`).
- **Sign-in** accepts an e-mail or a username. It answers the same for an unknown account and a wrong password, and takes the same time for both (`spendPasswordCheckTime`), so it doesn't reveal which accounts exist.
- **Sign-up** with an e-mail already taken also answers 201, as a new account would: Better Auth doesn't reveal which e-mails are registered. Nothing is stored twice.
- **Sign-out** ends the session on the server and expires the cookie.
- **Get session** answers `{ session: null }` for an anonymous request, and works with an unverified e-mail.
- Passwords are hashed with bcrypt (`Bun.password`). The `role` can't be chosen by the client (`input: false`).
- A session lasts 30 days. A password reset ends all of the account's sessions.

The e-mail sending is a placeholder (`src/lib/email.ts`): in development the codes go to the console, in tests nothing is sent, and in production the server refuses to answer until a provider exists.

## Adding a route

1. Add the contract in `packages/shared/routes/src/routes/api/<domain>/<operation>.ts` and export it from the domain's `index.ts`. Reuse the models and validators.
2. Add the handler in `src/http/routes/<domain>/<operation>.ts`, named after the `operationId`. Start it with `new Elysia().use(modelPlugin())`, then `.use(authPlugin(...))` if it needs a session (before the route, or the `session` isn't typed in its handler), then the route.
3. Answer with `status(<code>, ...)`. Use 201 when a resource is created and returned, 204 (`noResponse()`, `status(204, null)`) when nothing is returned. An error is thrown as an `AppError`.
4. Fill the `detail` as above, then add the file to the domain's `routes.ts` and the domain to `http/routes/routes.ts` if it is new.
5. Test it: an e2e test in `src/http/routes/<domain>/` calls `app.handle(new Request(...))`.

## Migrations

The schema is in `packages/backend/db/src/schema`. After changing it: `bun run db:generate -- <name>` writes a SQL migration in `packages/backend/db/drizzle/migrations`, which is committed. Never edit an applied migration; write a new one.

## Tests

- **Unit** (`src/utils`, `src/http/plugins`): no database. The CSRF rules and the error shape.
- **E2e** (`src/http/routes`, `src/http/openapi.e2e.spec.ts`): the real Postgres of `.env.test`, with the migrations applied. Every test creates its own accounts, so the order doesn't matter.

Helpers that read a response body are typed as `any` on purpose: the assertions check the shape.

## Not in the template

A real API built on this base has more, and the template leaves it out on purpose. Add them when the project needs them:

- Authorization by role and ability (CASL) and row-level security in Postgres.
- Audit logs in the transaction of each change.
- Observability (Sentry and OpenTelemetry), rate limiting, and the Redis backoff of the sign-in.
- Password reset, e-mail change and account deletion (the Better Auth endpoints exist; the routes don't).
- Queues, cron jobs, server-sent events and webhooks.

## Placeholders

Every name, text and default here is a placeholder (`FIXME`): the title of the OpenAPI document, the tags, the pt-BR error texts and the e-mail provider.
