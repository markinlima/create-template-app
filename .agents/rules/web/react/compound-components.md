---
paths:
  - "templates/web/**"
  - "packages/web/**"
---

# Compound components

In the web app and the web libs (`@web/ui`, `@web/form`, ...), every React
component that is made of parts, or that may grow parts/features later, is a
**compound component**: the root component with its parts attached through
`Object.assign`. The reference for the composition and the naming is the
`card` component in the UI lib; the folder layout is described below.
Components without children follow the same pattern
(`Object.assign(ButtonRoot, {})`) so parts/features can be added without
changing how it is imported or used.

## Structure

One folder per component. The root and every part go in `components/`, one
file per part, kebab-case. Everything else the component needs that is not a
component goes in its own folder next to `components/`:

```
dialog/
  index.tsx                  # composition only
  components/                # the root and the parts
    dialog-root.tsx          # the root component
    dialog-content.tsx       # one part per file
    dialog-header.tsx
  context/                   # contexts the parts share
    dialog-context.ts
  hooks/                     # one hook per file
    use-dialog-context.ts
  utils/                     # one function per file
    get-dialog-size.ts
  constants/                 # only create the folders that are needed
  schemas/
  types/
```

- `index.tsx` only imports the parts from `./components/` and composes them.
  No component logic.
- The root lives in `components/<name>-root.tsx` and is named `<Name>Root`;
  parts are `<Name><Part>` in `components/<name>-<part>.tsx`.
- Code that is not a component (context, hooks, helper functions, constants,
  schemas, types) goes in `context/`, `hooks/`, `utils/`, `constants/`,
  `schemas/` or `types/` — whether several parts use it or only one. Don't
  keep it in a part's file and don't gather it in a `<name>-shared.tsx` bag
  file.
- One function per file in `utils/` and `hooks/` (a hook is a function). Never
  declare a helper function next to a component or next to another function.
  Handlers declared inside a component's body are fine.
- Keep parts that are only implementation detail (not attached through
  `Object.assign`) in a subfolder of `components/`, e.g. `components/internal/`.

```tsx
// index.tsx
export const Card = Object.assign(CardRoot, {
  header: CardHeader,
  title: CardTitle,
  content: CardContent,
});
```

## Naming

- The root **is** the component: `<Dialog>`, never `<Dialog.Root>`. When the
  component has no natural root, the provider/container is the root
  (`<Carousel>`, `<Fullscreen>`, `<Sidebar>`, `<StepForm>`).
- Parts are **camelCase** keys: `Dialog.content`, `DropdownMenu.checkboxItem`,
  `Select.scrollUpButton`. Nested groups follow the same rule:
  `Dialog.presets.confirmation`.
- Never name a part `name` or `length` (they collide with function
  properties).
- Name props that identify something other than a DOM element with a specific
  name (`stepId`, not `id`), otherwise Biome's `useUniqueElementIds` flags
  every usage.

## Exports

- Consumers import the compound only, from the component's entry point:
  `import { Dialog } from "@web/ui/dialog"`. Do not import part files directly
  and do not export parts as loose functions for consumers.
- Hooks, contexts, types and variants that consumers need (`useSidebar`,
  `ButtonProps`, `buttonVariants`) stay **named exports**, re-exported from the
  component's `index.tsx`.
- A part that needs a provider/context (e.g. it reads the form context) must
  say so in a comment next to the `Object.assign`.

## Don'ts

- Don't keep the old style: `Dialog.Root`, PascalCase parts, `export { A, AItem }`
  or several parts in one file.
- Don't `Object.assign` onto a third-party component (it mutates the library's
  export). Wrap it in your own root component first.
- Don't put logic in `index.tsx` and don't create a part for something that is
  not used in a JSX tree (helpers go in `utils/` or a hook).
- Don't declare context, hooks or helper functions in a part's file, and don't
  collect them in a `<name>-shared.tsx`: use the `context/`, `hooks/` and
  `utils/` folders of the component.

## Adding a part or a component

1. Create `components/<name>-<part>.tsx` exporting `<Name><Part>`.
2. Register it in the component's `index.tsx` with a camelCase key.
3. Update consumers and run `bun run lint` and `bun run ts:check` in the
   changed package and in the web template.

Biome treats a part named `label` as a native `<label>` (`noLabelWithoutControl`);
that rule is turned off for the web app on purpose.
