---
paths:
  - "templates/web/**"
  - "packages/web/**"
---

# Similar components with different business logic

Two components that look the same but do different things for the product are
**not duplicated code**. Keep them as separate components. Do not merge them
into one component with flags or mode props just to remove the repetition.

## What counts as different business logic

Keep them apart when any of these differs, even if the markup is identical:

- the request they send (another endpoint, mutation or payload);
- the validation schema or the rules for what is allowed;
- the cache they update after it works (see [query-cache.md](./query-cache.md));
- the tracking or analytics they report;
- who can use them (permissions) and what they show in each state;
- the side effects around them (navigation, toasts, closing a dialog).

Typical examples: the form to create a comment, the one to reply to a comment
and the one to edit it; the like button of a post and the one of a comment; the
card of a post in a feed and the card of a post in a search result.

## Why

Each version can then change on its own: add tracking to one, a permission to
another, a different loading state to a third, without a condition for every
case inside a shared component and without the risk of breaking the others. A
shared component with `mode`/`variant` props that switch the business logic ends
up with every rule of every case in one place.

## What to share

Share what is the same **on purpose** and has no business logic: purely visual
pieces and generic behavior. Put it in its own component, hook or util and let
each version use it.

- Presentation shared by all versions (a layout, an icon button, a field).
- Generic helpers (formatting, a hook that debounces, a list wrapper).

If a piece starts to carry a rule of one case, it stops being shared and goes
back to the version that owns it.

## How to name and organize them

- Name each version for what it does (`CreateCommentForm`, `ReplyCommentForm`,
  `EditCommentForm`), not `CommentForm` with a `type` prop.
- Keep them next to each other in the same feature folder.
- Each one follows the usual rules: one component per file, compound structure
  when it has parts, one function per file in `utils/` and `hooks/`.

## Don'ts

- Don't merge similar components only because their markup matches.
- Don't add a prop that switches the business logic of a component
  (`mode="reply"`, `isEdit`); make another component.
- Don't copy a rule from one version into another "to keep them equal": each
  version decides its own rules.
