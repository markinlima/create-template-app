# Testing

Follows the baseline in `.agents/rules/global/testing.md`.

- `lint` runs `ts:check` and Biome; `test:unit` (and `test`) runs `bun test` over every `*.test.ts` and `*.test.tsx`.
- No services or `.env.test` needed. Components are rendered to static markup (`react-dom/server`), so the cooldown timer and the dialog interactions are not covered; the queue logic is tested through its pure reducer.
