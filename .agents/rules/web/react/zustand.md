---
paths:
  - "templates/web/**"
  - "packages/web/**"
---

# Zustand

## Subscribe to the smallest value

A component should select the value it renders, not an object that changes for
other reasons. To know whether "this item is the current one", select the
boolean (`state.current?.id === id`), not `state.current`: with `Object.is`
only the components whose answer changed re-render, instead of every mounted
item. Use `useShallow` only to pick several primitives together.

## Read in handlers, don't subscribe

When a value is only needed inside an event handler or a callback that runs
later, read it with `useStore.getState()` at that moment. The component then
doesn't re-render when it changes, and the handler never sees a stale closure
(important for listeners registered once, like the ones added to a player
instance).

## Where each store lives

- State that is global to the app (the video player's volume and the video
  that is playing) lives in a store created with `create`.
- State that belongs to one instance of something (one post card, one video)
  lives in a store created with `createStore` and handed down by a provider,
  so each instance has its own.
- Put the logic that decides something (which video plays, what happens when
  one leaves the screen) in the store's actions, not in the components: it is
  then testable without rendering.
