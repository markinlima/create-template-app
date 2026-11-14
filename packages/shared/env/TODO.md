# @shared/env — TODO

Open points found while writing the AI documentation. Nothing here was changed; each item is an observation to confirm (is it intended or should it be fixed?) and, once resolved, to reflect in `AGENTS.md`.

## Schemas and tests

- [x] `opentelemetryEnvSchema` not being exported or wrapped in the preprocessor is intentional: it is a building block embedded in other schemas, which run the preprocessor. Documented in `AGENTS.md`.
- [x] Added unit tests (and a `test` script) for every schema and the sanitizer.
