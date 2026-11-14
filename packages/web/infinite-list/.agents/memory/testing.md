# Testing

Follows the baseline in `.agents/rules/global/testing.md`.

- `lint` runs `ts:check` and Biome; `test:unit` (and `test`) runs `bun test` over every `*.test.ts` and `*.test.tsx`.
- No services or `.env.test` needed. The tests render to static markup (`react-dom/server`), so there is no DOM: the pagination trigger and scrolling are not covered.
