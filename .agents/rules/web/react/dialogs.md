---
paths:
  - "templates/web/**"
  - "packages/web/**"
---

# Dialogs

Every dialog of the web app looks and is built the same way. The reference is the block user dialog.

## Buttons go in the footer

The buttons of a dialog (confirm, cancel, send, close) are inside `Dialog.footer`, never loose in the body or in the header.

Exceptions are buttons that belong to something else inside the dialog, not to the dialog itself: the submit button of a
form that the dialog holds goes in a `Dialog.footer` inside the form, and a button that is part of
a field (the picker of a color, the remove button of an attached file), a "back" button of a step the dialog is made of, a
control in a list or a form (the "other reason" toggle). The test is whether the button decides what happens to the
dialog (then it is footer) or to a piece of its content (then it stays with it).

Every button of a dialog is `raised`, the ones in the footer and the ones that stay in the body.

The confirmation preset already builds the footer (with its buttons raised): use it instead of writing one for a plain "confirm or cancel".

## The title

`Dialog.title` already comes with the look of every title (`flex items-center gap-2 font-bold`), so a title is written like
this, always, without classes of its own:

```tsx
<Dialog.header>
  <Dialog.title>
    <RoundedIcon variant="warn">
      <ShieldUserIcon />
    </RoundedIcon>
    Bloquear usuário
  </Dialog.title>
  <Dialog.description>...</Dialog.description>
</Dialog.header>
```

- The icon is inside a `RoundedIcon`, on the left of the text. A title without an icon is not allowed.
- Don't pass a `className` to the title, and never a size (`text-lg`, `text-xl`): every title has the same size and weight. If a
  title needs a different look, the title is wrong, not the rule. (Centering it, as in a centered header, is the one layout
  tweak that is fine.)
- The `variant` of the `RoundedIcon` follows the meaning of the dialog (`destructive` for something that can't be undone,
  `warn` for a care, the default for the rest).
- The icon says what the dialog is about (a trash can for deleting, a hammer for banning). A VIP dialog uses the icon of the
  plan (see the VIP title component).
- A title that only screen readers get (`sr-only`, for a dialog that has no visible title, like the settings dialog) is the
  exception: it has no icon.
- A description goes in `Dialog.description`, inside the header, under the title.

## Don'ts

- Don't put a button in the body of a dialog just because it is simpler than a footer.
- Don't leave a button of a dialog flat (without `raised`).
- Don't write a title as plain text, with a bare icon or with its own size and weight.
- Don't make a second look for titles "because this dialog is special": change the reference and every dialog follows.
