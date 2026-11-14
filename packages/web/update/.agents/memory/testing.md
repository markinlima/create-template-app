# Testing: @web/update

Follows the baseline of [testing](../../../../../.agents/rules/global/testing.md). Tasks: `lint`, `ts:check`, `test:unit`, `test`. No services, no `.env.test`.

- Coverage: `bun test --coverage`. Lines are about 98%.
- `src/lib/browser-events.ts` is tested with a fake `document` and `window` (an `EventTarget` on `globalThis`), no DOM library.
- Hooks: `renderToStaticMarkup` (`react-dom/server`, as in `@web/alert`) only reads the initial state, because zustand's server snapshot is `getInitialState()`. Hook reads after `check()` are tested through the store (`stores/create-update-store.test.ts`) instead.
- Open: the hooks after a check (and their `watch` effect) have no test. They need a client render, so a DOM library such as `happy-dom`. Not added yet: a new library is asked first.
