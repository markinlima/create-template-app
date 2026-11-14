# Code comments

**Almost never add comments.** Good names, types and small functions explain the
code. Comments are the exception, short and direct, and never a way to narrate
what the code does.

This rule covers **inline comments only**. Documentation (TSDoc, `README.md`,
`docs/*.md`) has its own rule.

## Where an explanation goes instead

If a function, module or flow needs explaining, don't write it as an inline
comment: put it in the reply to the user, in the TSDoc of the exported symbol,
or, when the language has no TSDoc, in the docs. This includes an exported
variable, constant, type or interface: its meaning goes in its TSDoc, not in a
`//` comment above it, which an importer never sees.

## When an inline comment is allowed

Only when the code alone does not make the intent obvious:

- a magic value or unit: `const ttl = 3 * 60 * 60 * 24; // NOTE: 3 days, in seconds`
- a non-obvious _why_: a workaround, a browser/library quirk, an ordering
  constraint, a deliberate deviation from the convention
- a pending item: `TODO:` / `FIXME:` (placeholders stay marked with `FIXME`)

Never comment: what the next line obviously does, a changelog ("added for X",
"removed Y"), the name of the task or PR, commented-out code, section banners.
Delete outdated comments you touch.

## Style

- **One line, a few words.** Two lines is the ceiling; if it needs more, it is
  documentation (see above).
- English, per [language](../global/language.md).
- Say _why_, not _what_.

## Highlighted tags

Start the comment with an uppercase tag and a colon, so it is colored in both
VS Code and Zed:

| Tag      | Use                                              |
| -------- | ------------------------------------------------ |
| `NOTE:`  | a non-obvious fact, unit or reason               |
| `WARN:`  | a trap: changing this breaks something elsewhere |
| `HACK:`  | a workaround that should go away                 |
| `TODO:`  | work still to do                                 |
| `FIXME:` | something known to be wrong or a placeholder     |

```ts
const sessionTtl = 3 * 60 * 60 * 24; // NOTE: 3 days, in seconds
// HACK: Safari fires blur before click; defer to let the click land
// TODO: handle expired sessions once the refresh endpoint exists
```

A `TODO:` goes right where the missing piece is, with a short explanation of
what is missing. The tags are for inline comments; TSDoc blocks (`/** */`) are
not covered here.
