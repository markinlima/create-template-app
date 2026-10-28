---
paths:
  - "templates/web/**"
  - "packages/web/**"
---

# Schemas

Zod schemas (form validation, search params, request bodies the app extends)
are kept in a **`schemas/`** folder. There are two levels:

- **Next to the code that owns them**: a module can have its own `schemas/`
  folder, and so can a compound component (see
  [compound-components.md](../react/compound-components.md)). Use it for
  schemas only that module or component uses.
- **At the root of the app's source** (the app-level `schemas/` folder): for
  global schemas, the ones used across modules, such as the ones that extend a
  generated schema with client-only fields. If a schema starts being used by
  another module, move it there.

## Don'ts

- Don't put schemas in `constants/`.
- Don't declare a schema inside a component file; the component imports it
  from `schemas/` (and its inferred type from the same file).
- Don't edit the generated API layer to add fields: extend its schema in a
  `schemas/` file instead.
