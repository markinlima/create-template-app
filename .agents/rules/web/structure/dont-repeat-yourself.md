---

paths:

- "apps/web/**"
- "packages/web/**"

---

# Don't repeat yourself

Before writing a function, hook, schema, type, constant or component, look for
one that already does the job. Each copy must be fixed, tested and kept in sync
on its own, so repetition is a cost. The opposite is also a cost: a shared piece
that serves two cases with different reasons to change fills up with flags and
conditions. Share what is the same, keep apart what only looks the same.

## 1. Look before you write

Search before creating anything that does a generic job (formatting, parsing,
a check, a fetch wrapper, a schema, a hook, a piece of UI):

- the current module (`utils/`, `hooks/`, `schemas/`, `components/`,
  `constants/`, `types/`);
- the global folders of the app (`src/utils/`, `src/hooks/`, `src/schemas/`,
  `src/components/`, `src/core/`, see
  [folder-structure](./folder-structure.md));
- the web packages the code may import (`packages/web/*`, and
  `packages/shared/*` for pure logic, see
  [package-dependencies](../../typescript/package-dependencies.md));
- what the generated code and the libraries in use already give (the Kubb hooks
  in `gen/`, Zod, TanStack Query).

Search by what the code does, not only by the name you were about to give the
new function: `grep` for the key words (`currency`, `debounce`, `slug`), not just
for your own name. A function with another name often already exists.

If something almost fits:

- **the same operation, a new case**: extend it in a generic way (an optional
  parameter, a more general type). Never copy it and change the copy;
- **a different business rule**: it is not the same thing; see section 4.

## 2. Create it once when it does not exist

When nothing exists and the logic is generic, write it once, where every user can
reach it:

- used by one module only: that module's `utils/` or `hooks/`;
- used by several modules of the app: the app's global folder (`src/utils/`,
  `src/hooks/`, `src/schemas/`);
- used by several web apps or packages: `packages/web/*` (browser-only code) or
  `packages/shared/*` (pure logic that the backend may use too).

Generic helpers go to the shared folder even with one caller today, because they
are generic by nature. Logic that belongs to one case stays local until a second
place really needs it.

One function per file, named for what it does, with TSDoc
([documentation](../../doc/documentation.md)) and tests written first
([tdd](../../global/tdd.md)).

## 3. Components: one base, one use case per place

When several places show the same kind of component (a card of users, a list
item, a menu), build **one generic base** and one thin **variant** per place:

- the base builds the structure: layout, parts, visuals. It receives what
  changes through props, children or slots (see
  [compound-components](../react/compound-components.md));
- the base is presentational and generic: no endpoint, mutation, permission,
  tracking or navigation rule. Those go in the variant;
- each variant fills in its own data and its own behavior for the place where it
  is used. Name it for that use (`FollowerUserCard`, `MemberUserCard`).

Props that only change how something looks (size, tone, a layout option) are
fine in the base. Props that switch business logic are not
(`variant="admin"`, `mode="reply"`, `isEdit`): make another variant instead.

## 4. When repeating is better

The test is one question: **would a change to one case force a change to the
other?** If yes, they are the same thing: share them. If each case can change on
its own, keep them apart, even when the markup or the code is identical.

Keep them apart when any of these differs:

- the request (another endpoint, mutation or payload);
- the validation schema and the rules for what is allowed;
- the cache updated after it works (see [query-cache](../react/query-cache.md));
- the tracking or analytics it reports;
- who can use it (permissions) and what each state shows;
- the side effects around it (navigation, toasts, closing a dialog).

Example: the form to **create** a comment and the form to **edit** it send the
same values (text and an attached image) to different endpoints. The business
rules differ, the cache is different, and the analytics events differ too. Keep
`CreateCommentForm` and `EditCommentForm` as two components. Share what is
presentation or generic (the text field, the image picker, the upload helper).
Do not write one `CommentForm` with an `isEdit` prop: the next change to one of
them (an analytics event, a rule of who can edit) would add a condition for each
case inside the shared code.

What stays shared in these cases is the presentation and the generic helpers.
A business rule is never shared.

## When in doubt

Whether two flows follow the same business rule is a product decision. If it is
not clear from the code, ask the user before merging or copying
([plan-before-implementing](../../ai/plan-before-implementing.md)).

## Don'ts

- Don't create a function, hook, schema or component without searching first.
- Don't copy a function and edit the copy when the original almost fits.
- Don't merge two components only because their markup matches.
- Don't add a prop that switches business logic (`mode`, `variant`, `isEdit`).
- Don't copy a rule from one case into another to "keep them equal": each case
  owns its rules.
- Don't extract a helper from a single case when the logic is specific to it.
