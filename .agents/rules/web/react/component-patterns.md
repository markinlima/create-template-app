---
paths:
  - "templates/web/**"
  - "packages/web/**"
---

# Component patterns

Rules for writing React components in the web app and the web libs. They
exist because these mistakes keep showing up in new code.

## Components with children or parts

If a component has children, or can be split into parts, it is a
**compound component** — root plus parts attached with `Object.assign`.
Follow [compound-components.md](./compound-components.md) for the folder
structure, naming and exports.

## One component per file

Never declare more than one component in the same file.

- First check whether the pieces belong to a compound component. If they do,
  make each one a part (one file per part) as described in
  [compound-components.md](./compound-components.md).
- If they do not fit a compound component, split them into separate files
  and group them in a folder with a common name (e.g. `comment-feed/`
  holding the files for that feature). Each file exports one component.
- This includes small "helper" components used by only one parent: they get
  their own file too.

## One function per file, outside the component

Helper functions (anything that is not a component and not a handler declared
inside a component's body) never share a file with a component or with another
function. Each one goes in its own file in a `utils/` folder (hooks in
`hooks/`) next to the component that uses it, as described in
[compound-components.md](./compound-components.md). Constants, types and
schemas may share a file with each other, but not with a component.

## Function declarations, not arrow functions

Declare components, helpers and handlers with the standard JavaScript
`function` declaration. Do not declare them as arrow functions.

```tsx
// good
export function CommentCard(props: CommentCardProps) {
  function handleSelect() {
    // ...
  }

  return <button onClick={handleSelect}>...</button>;
}

// bad
export const CommentCard = (props: CommentCardProps) => {
  const handleSelect = () => {
    // ...
  };

  return <button onClick={handleSelect}>...</button>;
};
```

The only exception is when an arrow function is required by a React hook
that takes a function, such as `useCallback`, `useMemo`, `useEffect` or
`useReducer`:

```tsx
const handleSelect = useCallback(() => {
  // ...
}, []);
```

## Don'ts

- Don't put two components in one file, even if one is tiny or private.
- Don't write `export const Foo = () => ...` for components.
- Don't use an arrow function just because it is shorter; use it only when
  a hook needs it.
