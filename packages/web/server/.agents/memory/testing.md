# Testing

Follows the baseline in `.agents/rules/global/testing.md`.

- `lint` runs `ts:check` and Biome; `test:unit` (and `test`) runs `bun test` over every `*.test.ts`.
- No services or `.env.test` needed. The tests cover the pure functions in `utils/`, the health-check script and the Vite plugin; the Nitro handlers are not tested through a running server.
- The Vite entry is tested with fake Nitro and plugin contexts; a real `vite build` of `apps/web` plus a run of `dist/server` was checked by hand (health, files, SPA fallback), not in the suite.
