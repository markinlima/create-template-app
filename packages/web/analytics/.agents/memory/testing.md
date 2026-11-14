# Testing

Follows the baseline in `.agents/rules/global/testing.md`.

- `lint` runs `ts:check` and Biome; `test:unit` (and `test`) runs `bun test` over every `*.test.ts`.
- No services or `.env.test` needed. `window` is stubbed with `stubGlobal` from `@shared/utils/test`, and timers are faked.
