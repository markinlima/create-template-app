# Documentation patterns

How to document code and behavior. Inline comments are a different thing and
have their own rule: [code-comments](./code-comments.md). The `doc-updater`
agent follows this file when it updates docs.

Documentation is part of the change: update it in the same change as the code,
never "later". Commit it with the `docs` type (see [commits](../git/commits.md))
or inside the commit that changed the behavior.

## 1. TSDoc on the code

Exported functions, components, hooks and classes always get a TSDoc block, so
the hover in the IDE explains what they are and how to use them. Follow the
[TSDoc standard](https://tsdoc.org/).

Exported **types, interfaces, variables and constants** get one when the name
alone does not say what they are for, or when changing the value has an effect
a caller must know. Not every one needs it: a clear name with no behavior
behind it is enough. Use it to say what it is for, its default value, its
units, and what changing it does. An explanation written as a `//` comment above
an exported declaration moves to its TSDoc, because a comment there is not seen
when the symbol is imported.

- **Summary first**: one short sentence in the imperative or present tense that
  says what it does. More detail goes under `@remarks`.
- **`@param name - description`** for every parameter (a hyphen after the name).
  For an options object, document each field on the options type itself.
- **`@returns`** says what comes back and when it can be empty or `undefined`.
- **`@defaultValue`** on every optional parameter or prop that has a default.
  This is the TSDoc name of the tag; don't write `@default`.
- **`@example`** with a short, correct snippet for anything a caller can misuse.
  Examples must be verified against the code, never invented.
- **`@throws`** for errors the caller is expected to handle.
- **`@typeParam`** for generics, **`@see`** / `{@link}` for related symbols,
  **`@deprecated`** with what to use instead.
- Don't repeat the TypeScript type in the text and don't use `{type}` braces:
  the signature already shows it. Say the _meaning_, the units, the edge cases.
- Components: document the component and each prop on the props interface.
- Variables and constants: document the meaning, the unit and the default value
  (`@defaultValue`) when the name is generic, and what changing the value does.
  Example: `/** Time, in ms, a profile stays fresh. @defaultValue 300000 */`.
- Plain TSDoc only: no highlight tags (`NOTE:`, `TODO:`) inside `/** */`.

```ts
/** Options of {@link formatPrice}. */
export interface FormatPriceOptions {
  /**
   * BCP 47 locale used to format the number.
   * @defaultValue "pt-BR"
   */
  locale?: string;
}

/**
 * Format an amount in cents as a localized currency string.
 *
 * @param cents - Amount in cents, e.g. `1999` for 19.99.
 * @param options - See {@link FormatPriceOptions}.
 * @returns The formatted price, e.g. `"R$ 19,99"`.
 * @example
 * formatPrice(1999); // "R$ 19,99"
 */
export function formatPrice(cents: number, options?: FormatPriceOptions) {}
```

Other languages use their own doc-comment format (Python docstrings, rustdoc,
godoc) with the same content: summary, params, returns, defaults, example.

## 2. Where everything else is documented

The repo is the **single source of truth** for technical documentation. Behavior
that does not belong on one symbol (flows, setup, decisions, guides) goes in one
place, in this order:

1. **`docs/*.md`** next to the code it describes (see section 3), for flows,
   setup, decisions and guides.
2. The workspace's `README.md` and `AGENTS.md` for what is local to it: what it
   is, scripts, structure, conventions. Keep the two identical, linking instead
   of copying shared sections; `CLAUDE.md` stays exactly `@AGENTS.md`.

Tickets, roadmap and product decisions live in the project tracker (e.g. Plane).
A ticket links to the repo doc that explains the topic; it does not copy it.
Don't write technical docs in an external tool, and never change tickets while
updating docs.

One topic lives in one place; everywhere else links to it. Agents search the
repo with the terminal (`grep`, `find`) before they reach for any external tool.

## 3. Size of AGENTS.md

Keep `AGENTS.md` files short. If the documentation for a location (the repo
root, an app or a package) would total more than 200 lines, split it into
smaller files instead of writing everything into one large `AGENTS.md`.

- Move the detail into topic files under a **`docs/` folder at the same level**
  as that `AGENTS.md` (e.g. `apps/backend/docs/auth.md`), never in `.agents/`.
- `AGENTS.md` becomes an **index**: for each doc file, a link and a one-line
  description of what it covers. Don't copy the doc content into `AGENTS.md`.
- Agents then load only the file the task needs, not every doc up front.

The 200-line limit applies per location, to that location's own `AGENTS.md`.

## 4. References

Don't reference specific source files inside documentation. File paths change
often and the docs go stale. Point the reader to the folder that holds the code
instead (e.g. "look at the files in `src/http/routes/`"). Links to other
`AGENTS.md` or `docs/*.md` files are fine: they are navigation, not source
references.

## 5. Good practices

- **Structure by purpose** ([Diátaxis](https://diataxis.fr/)): a tutorial
  (learning), a how-to (a task), a reference (facts), an explanation (why).
  Don't mix them in one page.
- **One topic per file**, kebab-case file names (see [naming](../typescript/naming.md)),
  one `#` title, headings in order, no skipped levels.
- **Write short**: present tense, active voice, plain words, short paragraphs,
  lists and tables for facts. Lead with what the reader needs to do or know.
- **Code blocks with a language tag**, commands copy-pasteable, relative links
  between docs, no absolute local paths.
- **Verify before writing.** Document only what you confirmed in the code or by
  running it; if you could not verify, say so or leave it out.
- **No drift**: when you rename, move or remove something, search the docs,
  rules, skills and memory for the old name and fix every reference.
- **Don't document the obvious or the history.** No changelog prose inside
  docs; release notes follow [Keep a Changelog](https://keepachangelog.com/)
  with [SemVer](https://semver.org/) when the project keeps a `CHANGELOG.md`
  (see [releases](../git/releases.md)).
- **Language**: English (see [language](../global/language.md)); user-facing product
  text is the exception defined there.
- **Never put secrets or real values** in docs; use `.env.example` names and
  obviously fake placeholders marked `FIXME`.
