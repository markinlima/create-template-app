# Testing

Follows the baseline in `.agents/rules/global/testing.md`.

- `lint` runs `ts:check` and Biome; `test:unit` (and `test`) runs `bun test` over every `*.test.ts`.
- No services or `.env.test` needed. The probes that touch the DOM (the bait element and the bait script) are mocked in the `detectAdblock` test and not exercised for real.
- The Vite plugin is tested by calling its hooks with a fake `this` and a fake dev server; a real `vite build` and `vite dev` run was checked by hand, not in the suite.
