# Testing: @web/theme

Follows the baseline of [testing](../../../../../.agents/rules/global/testing.md). Tasks: `lint`, `ts:check`, `test:unit`, `test`. No services, no `.env.test`.

- The store is tested with an in-memory `storage` passed through its options, because `bun test` has no `localStorage`.
- `applyThemeToBody` is tested with a fake target (a `Map`-backed `style` and attributes), no DOM library.
- The hook is read with `renderToStaticMarkup`, so only the initial state is covered. The layout effects of `ThemeProvider` have no test: they need a client render (a DOM library, which is asked first).
