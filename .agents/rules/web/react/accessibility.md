---
paths:
  - "templates/web/**"
  - "packages/web/**"
---

# Accessibility

A baseline for every interactive piece of UI in the web app and the web libs.

## Interactive elements

- Anything clickable is a real `button` or link, never a `div` with `onClick`.
  Never put a button inside another interactive element.
- To make something else open or trigger something, give the trigger the
  element through the `render` prop (Base UI `useRender` and `mergeProps`),
  like `Dialog.trigger render={<Button />}`, so there is a single interactive
  element and it keeps its native keyboard behaviour.
- When a `div` cannot be avoided (it wraps text, headings...), give it
  `role="button"`, `tabIndex={0}` and Enter and Space handling, and ignore keys
  that come from elements inside it.

## Names

- A button with only an icon always has an `aria-label`, written in
  Brazilian Portuguese (pt-BR), that follows its state ("Pausar" and
  "Reproduzir", "Silenciar" and "Ativar som").
- Sliders get a label and a readable value text (`thumbLabel` and
  `getThumbValueText` in the UI lib's slider).

## Keyboard

- Whatever shows on hover also shows on keyboard focus (`focus-within` on the
  container, `focus-visible` on the control).
- Never hide something from the keyboard with `display: none` if it is the
  only way to operate it. Use `opacity-0` with a visible focus state instead.
- Don't use `role="toolbar"`, `role="group"` and the like just to silence the
  linter; use the semantic element or ignore the rule with a reason.
