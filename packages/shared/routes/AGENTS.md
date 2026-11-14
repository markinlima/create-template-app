# `@shared/routes` – AI Instructions

## What it is

The API contract of the template: Zod schemas for the models (the public shape of an entity), the validators of the fields, and the request/response shape of each operation. The backend (`apps/backend`, Elysia) imports them, and so does any client that wants the same wire format. It has no runtime dependency besides `zod`.

It is the generic example of the openapi abstraction: a copy of this package with the domains of a real project replaces the placeholders here.

## Main technologies

- **Zod 4** (`zod`): every contract is a Zod schema; TypeScript types are inferred from them.
- **TypeScript** (strict), **Bun** runtime, **Biome** for lint.

## Useful scripts

Run from inside `packages/shared/routes`:

| Script     | What it does                                     |
| ---------- | ------------------------------------------------ |
| `lint`     | Type-check + Biome check; run after every change |
| `ts:check` | `bun check`                                      |
| `lint:fix` | Biome check with automatic fixes                 |

## Exports

| Import path                     | What it contains                                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `@shared/routes/api/<resource>` | The contract of each operation of a resource: `<operation>Query`/`Params`/`Body`/`Response` and their types.              |
| `@shared/routes/models`         | The named models (`errorModel`, `userModel`, `sessionModel`, `healthModel`), `openApiTag`, `dataShape`, `paginationType`. |
| `@shared/routes/validators`     | The field rules (`authValidator`, `usernameValidator`) and their `MIN_*`/`MAX_*` constants.                               |
| `@shared/routes/utils`          | `ref` (names a schema in the OpenAPI document) and `getModels` (the registry the backend registers on Elysia).            |

## Layers and how they relate

1. **Models**: the public shape of an entity (`userModel`). Dates are ISO strings (`z.iso.datetime()`), never `Date`. The backend maps the database row to the model (`apps/backend/src/mappers`), so an internal column never leaks.
2. **Validators**: the rules of the fields (`authValidator.password()`), reused by the bodies of several operations.
3. **Operation contracts** (`api/*`): compose the above into the `Query`/`Params`/`Body`/`Response` of one operation. A response always nests its data under a named property (`{ user }`, `{ items }`), never at the root.

Models are tagged with `.meta(ref("Name"))`, which turns them into a named `$ref` in the OpenAPI document. Every `ref` model must also be listed in `getModels()` (`src/utils/models.ts`), or the `$ref` doesn't resolve. `getModels()` strips `$ref` and `allOf` from the registered copies to avoid circular references.

## Conventions

- **File names**: kebab-case. An operation's file is named after its `operationId` (`<verb>-<resource>`, e.g. `sign-in.ts`), and the backend route file has the same name.
- **Exported names**: `<operation>Body`, `<operation>Response` (and `...Query`/`...Params` when they exist), plus the types. Types use `z.input` for requests and `z.infer` for responses.
- **Validation messages are user-facing and written in Brazilian Portuguese (pt-BR)**; identifiers and comments are in English.
- **No `any`**: use `unknown`.

## Adding things

**New operation contract**

1. Add a folder under `src/routes/api/<resource>/` (with an `index.ts` re-exporting its files) and one file for the operation with its body/response schemas.
2. Reuse the existing models and validators; don't redefine an entity's shape inline.
3. Wire it in the backend with the `create-elysia-route` rules of `apps/backend/AGENTS.md`.

**New model**

1. Add it in `src/models/` with `.meta(ref("<Name>Model"))`, and export it from `src/models/index.ts`.
2. Register it in `getModels()`, under the same name as the `ref`.

**New OpenAPI tag**: add it to `openApiTag` in `src/models/openapi.ts`, and to the `DocumentDecoration` type of the backend (`apps/backend/src/types/openapi.d.ts`).

## Gotchas

- The `./api/*` export maps `api/<x>` to `src/routes/api/<x>/index.ts`: a new resource folder without an `index.ts` doesn't resolve.
- Changing a schema changes the wire contract for every client at once: grep for the import before editing.
- A `ref` model missing from `getModels()` leaves its `$ref` unresolved in the OpenAPI document.

## Testing

No test suite here yet. The backend's e2e tests cover the contracts through the routes. Cases about a schema's own rules (a malformed body, a value out of range) belong here, as `*.unit.spec.ts` next to the schema, once the package needs them.
