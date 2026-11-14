# Testing

Follows the baseline in `.agents/rules/global/testing.md`.

- `lint` runs `ts:check` and Biome; `test:unit` (and `test`) runs `bun test` over every `*.test.ts`. No services or `.env.test` needed.
- The tests cover the pure functions in `utils/`. The hooks and the browser helpers (`utils/fullscreen`, `utils/mobile`, `detect-platform`) need a DOM and are not tested.
- `utils/infinite-data` imports `@shared/routes/schemas` and `CursorPaginationMeta` from `@shared/routes/utils`. `ts:check` passes only while `@shared/routes` keeps those exports.
