---

paths:

- "apps/web/**"
- "packages/web/**"

---

# Zustand

Zustand holds **client state**: what the app knows and the server does not
(theme, settings, the visitor's choices, the state of a widget). Data that comes
from the API belongs to the query cache ([query-cache](./query-cache.md)).

## Where a store lives

Pick the store by who owns the state:

- **Global to the app** (theme, settings, the visitor's choices): one store
  created with `create` at module level, in the module that owns it
  (`stores/<name>-store.ts`). Any component reads it, and code outside React
  reads it with `useStore.getState()`, with no provider.
- **Isolated to a part of the tree** (a player, an editor, a form that many
  components share, a widget that is placed more than once): a store created
  with `createStore` from `zustand` and handed down by a Context provider. Each
  instance of the provider has its own state, and the components below it read
  the state without props being passed through every level. The store is the
  same kind of store as the global one; only where it is created changes.
- **Global stores are not the answer for every shared state.** When the state
  belongs to one instance of something, use the provider, so two instances do
  not share it.

### Provider with Context

The provider creates the store once, in a lazy `useState`, and the hook that
reads it throws when there is no provider above, so a missing provider fails at
the first render with a clear message:

```tsx
// NOTE: the store is created inside the provider so each instance gets its own
export function PlayerProvider({ children, initialVolume }: PlayerProviderProps) {
  const [store] = useState(() => createPlayerStore({ volume: initialVolume }));

  return <PlayerContext value={store}>{children}</PlayerContext>;
}
```

- The factory (`createPlayerStore`) takes the initial values as an argument and
  returns `createStore(...)`. The props of the provider are the input of the
  store, not a copy kept in state.
- Never create the store at the top of a component body or with `create` inside
  a component.

## Subscribe to the smallest value

A component reads exactly what it renders, with a selector:

- Select one primitive per call: `useStore((state) => state.volume)`. A component
  re-renders only when that value changes.
- To know whether "this item is the current one", select the boolean
  (`state.current?.id === id`), not `state.current`.
- Selectors that return a **new object or array** re-render on every store
  change, even when the content is equal, because `Object.is` compares
  references. Wrap them with `useShallow` (`zustand/react/shallow`), which
  compares the fields of the result:

```ts
import { useShallow } from "zustand/react/shallow";

const { theme, setTheme } = useSettingsStore(
  useShallow((state) => ({ theme: state.theme, setTheme: state.setTheme })),
);
```

- Never select the whole state (`useStore((state) => state)`): the component
  then re-renders on every change of the store. The sample of the official
  Next.js guide does this for brevity; don't copy it.

## One hook per read, with `useShallow` inside

When several components read the same slice of a store, write the selector once,
in a hook of the module (`hooks/use-<name>.ts`), with `useShallow` already applied
when the selector returns an object or an array:

```ts
// hooks/use-theme-settings.ts
export function useThemeSettings() {
  return useSettingsStore(useShallow((state) => ({ theme: state.theme, setTheme: state.setTheme })));
}
```

- Components import the hook. They don't import `useShallow` and don't repeat
  the selector: one hook, one place to change what the screen reads.
- A hook that returns a single primitive doesn't need `useShallow`.
- One hook per file, named for what it reads (`use-theme-settings`, not
  `use-settings-store`).

## Update the state with `set`, and keep the logic in the store

- Change the state only with `set` (or `setState`) inside an action. Never
  mutate the state object.
- The actions live next to the state, in the same `create`/`createStore` call.
  A store can also keep its actions outside, as module functions that call
  `useStore.setState`, when that helps code splitting. Pick one per store and
  stay with it.
- The logic that decides something (which video plays next, what happens when
  one leaves the screen) lives in the actions, not in the components, so it can
  be tested without rendering.
- When a store grows, split it into slices: functions that take `set` and `get`
  and return part of the state, combined in one store (see the
  [slices pattern](https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/slices-pattern.md)).

## Read in handlers, don't subscribe

When a value is only needed inside an event handler or a callback that runs
later, read it with `useStore.getState()` at that moment (or the `get` of the
store). The component doesn't re-render when it changes, and the handler never
sees a stale closure, which matters for listeners registered once.

## Persist only what must survive a reload

- Add `persist` (`zustand/middleware`) only to a store whose data must survive a
  reload, such as the visitor's choices. A store without `persist` keeps nothing
  after the page is closed, and that is the default.
- Give the storage a unique `name`, store only the data with `partialize`
  (never the actions), and set a `version` with a `migrate` function as soon as
  the shape of the data changes, so an old value doesn't break the app.
- `createJSONStorage(() => localStorage)` is the storage of the app. Browser
  storage can be unavailable: the store must work with its defaults when it is.

## Outside React

- Read and change a global store with `useStore.getState()` and
  `useStore.setState()` in utils, handlers and other modules, without a hook.
- A store created with `createStore` from `zustand/vanilla` is the same
  object, without the React binding. The React hook is `useStore(store, selector)`
  from `zustand`.

## Don'ts

- Don't select the whole state, or return a new object or array from a selector
  without `useShallow`.
- Don't call `useShallow` in each component: put it in the hook of the store.
- Don't put API data in a store. Use the query cache.
- Don't create a store inside a component body, and don't share a store between
  instances that must be isolated.
- Don't persist actions, and don't persist a store that holds no data that must
  survive a reload.
- Don't mutate the state object; always go through `set`.
- Don't use a provider with a store for state that every part of the app shares:
  that is a global store.

## Sources

- [Practice with no store actions](https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/practice-with-no-store-actions.md)
- [Prevent rerenders with useShallow](https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/prevent-rerenders-with-use-shallow.md)
- [Initialize state with props](https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/initialize-state-with-props.md)
- [Setup with Next.js](https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/nextjs.md) (the per-instance store with Context)
- [Flux-inspired practice](https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/flux-inspired-practice.md)
- [Auto generating selectors](https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/auto-generating-selectors.md)
