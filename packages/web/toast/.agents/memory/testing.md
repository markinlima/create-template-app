# Testing: @web/toast

Follows the baseline of [testing](../../../../../../.agents/rules/global/testing.md). Tasks: `lint`, `ts:check`, `test:unit`, `test`. No services, no `.env.test`.

- The API (`toast.ts`), the managers and `resolveToastPosition` are tested with spies on the Base UI managers and stubbed `window.matchMedia` (`stubGlobal` of `@shared/utils/test`). No DOM.
- Not tested yet: the React components (`ToastProvider`, the stack, the list and the base toast). They render Base UI portals and need a DOM library. Not added: a new library is asked first.
