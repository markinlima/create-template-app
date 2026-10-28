---
paths:
  - "templates/web/**"
  - "packages/web/**"
---

# Styling

## Shared Tailwind classes

When a set of Tailwind classes is reused (a grid template, a layout, a list
of utilities that always go together), define it as a **`@utility`** in the
web app's utilities stylesheet (the `utility.css` in the `src/styles/`
folder) and use it by name: `className="grid-compact-posts"`. Editors
autocomplete these names and the classes stay organised in one place. Look at
the `@utility` blocks already there for the conventions: they include the
`display` they need (`grid`, `flex`) and apply responsive variants in
separate `@apply` lines.

### Don'ts

- Don't keep shared class lists in TypeScript (`export const GRID_CLASSNAME =
  "grid-cols-2 gap-2 ..."`). Move them to the utilities stylesheet.
- Don't combine a utility with `cn("grid", ...)` to add what it should already
  contain; put the base classes in the utility.

Variant sets that belong to one component (`size`, `variant`...) stay in that
component, built with Tailwind Variants (`tv`); this rule is for plain, reusable
class lists.

## Colors come from the theme

Tailwind's default color palette is turned off in the app (the global
stylesheet resets `--color-*` in its `@theme` block). Classes such as
`bg-red-500` or `text-gray-700` generate nothing, so you must use the colors the
themes define, which are CSS variables exposed as Tailwind colors: `bg-background`,
`text-foreground`, `bg-primary`, `text-muted-foreground`, `border-input`,
`bg-destructive`, and so on. Opacity modifiers work (`bg-black/20`). Look at
that `@theme` block for the full list of tokens before picking a color.

- If a color you need doesn't exist, add a token for it instead of using a hex
  value or an arbitrary one (`bg-[#fff]`, `text-[rgb(...)]`). A token that must
  change with the theme is exposed in the `@theme` block and needs a value in
  every theme (`defineTheme` requires every color token). A color that is the
  same in every theme (black, white, the medal colors, the status colors) is
  defined once, in the global stylesheet.
- Pick the token by meaning (`destructive`, `muted-foreground`), not by how it
  looks today, so the component follows the theme when the user switches it.
