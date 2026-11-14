# Testing

Follows the baseline in `.agents/rules/global/testing.md`.

- `lint` runs `ts:check` and Biome; `test:unit` (and `test`) runs `bun test` over every `*.test.ts`.
- No services, generated files or `.env.test` needed: the tests use pure functions and temporary folders.
