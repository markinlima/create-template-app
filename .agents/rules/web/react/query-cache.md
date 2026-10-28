---
paths:
  - "templates/web/**"
  - "packages/web/**"
---

# TanStack Query cache

## Client-only state that must last for the session

A flag the API doesn't know about, but that must not be lost while the user
navigates (for example "this post was already viewed"), is injected into the
cached data instead of living in component state. Declare it as an optional
field in the app's local schema of the entity (the local post type), and set it
with the cache update helper (`updateQueryData`), which patches the entity in
every cache that holds it: feeds, lists and single items. Components then read
it from the data they already receive.

The flag is lost when the query is refetched or the page is reloaded; that is
expected. If it must survive, the API has to store it.

## Where the cache code lives

Everything that changes the cache is in `hooks/custom-hook-options/`, in **one folder per module** (`post/`, `user/`,
`comment/`, `collection/`...): the custom options of the module's hooks (`<module>-hook-options.ts`), the functions they use
(`utils/`, one function per file) and their tests next to them. The functions that only touch the query client don't belong to
the module they are about (`modules/app/...`): a component never calls them, only the custom options do. A function that two
modules use stays in the folder of the module that owns what it changes, and the other one imports it.

## Update the cache, don't fetch it again

The generated hooks never refresh anything by themselves: the `x-cache-entity` tag of a route only becomes the first part of
the query keys (`["Post", ...]`). Every mutation that changes something the app shows needs custom options, and they change
the cache **with the data the app already has**:

- Use the helpers of the shared lib (`updateQueryData`, `addItemToFirstPage`, `deleteItemFromPages`, `findQueryData`), with the
  optimistic update and its rollback on error.
- Where they don't fit, change the data directly with Immer. It is usually less code than it looks, and it is the point of
  having those helpers: the user doesn't wait for a new request.
- To roll back a removal, read what was removed before removing it and give it back through the context of `onMutate`.

`invalidateQueries` is the last resort, only for:

1. something that depends 100% on the answer of the server (the address of an uploaded file, a position or an order only the
   API knows) and that the answer of the mutation doesn't carry, or
2. a change that reaches so many places that patching them in code would be hard to follow and to maintain.

Prefer reading that one value from the API and putting it in the cache (the client of the route) over invalidating many
queries. Keep in mind that the app doesn't refetch a query when it mounts (`refetchOnMount` is off) and that a disabled query,
like the session, is never refetched by an invalidation: invalidating only reaches what is on the screen right now.

A key like `["User"]` matches caches of other shapes too (the statistics of a user, a list), so the `where` of the helpers can
receive items it doesn't expect: they treat an item `where` can't read as "doesn't match" instead of throwing.

## Generated code

Never edit the generated API layer. When the app needs a type the API doesn't
have (a fallback value, a client-only status), define it in a module as a
local type built on top of the generated one.
