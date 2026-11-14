# package.json scripts

## Sections

`package.json` has no comments, so every `scripts` map is split into labeled
sections using a dummy key as a separator:

```json
"scripts": {
  "--- LINTING ---": "",
  "ts:check": "...",
  "lint": "..."
}
```

- The separator key is `"--- NAME ---"` (uppercase, dashes, no colon) with an
  empty string value. It is a no-op if invoked directly.
- Every script belongs to a section, even when the workspace has only one
  category of scripts.
- Reuse an existing section name when one fits. Introduce a new one only when
  none fits. Do not split a category into sub-sections (e.g. do not split
  `LINTING` into `TYPES` and `FORMATTING`).
- Common section names, in the order they usually appear:
  - `APP`: start, dev, build and preview of the app itself.
  - `API`: API client or spec generation.
  - `DATABASE`: schema and migration scripts.
  - `LINTING`: type-check, lint and lint fix.
  - `TESTING`: any test script.
  - `DOCKER`: image build and similar.
  - `UTILS`: one-off helpers that fit nowhere else.
  - The root `package.json` may use `DEVELOPMENT` instead of `APP`/`API`,
    since its scripts usually delegate to Turborepo.

## Script names

Name scripts `context:action` or `context:action:subaction`, from the most
general to the most specific part:

- `context` is the area the script works on (`test`, `db`, `api`, `ts`).
- `action` is what it does (`check`, `generate`, `migrate`, `watch`).
- `subaction` is optional and narrows the action (`test:unit`,
  `db:migrate:generate`).

Keep names consistent across workspaces. The standard task names in
[testing](../global/testing.md) (`lint`, `ts:check`, `test:unit`, ...) follow
this pattern and are the names agents look for.

## Applying it

Apply this whenever you add a script to a `package.json`, or when you notice
one that is not in a section yet.
