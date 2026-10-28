# Web MPA template

Template of a React server-rendered (TanStack Start) app, with React 19, Tailwind CSS 4 and the `@web/*` libs. Everything in it is a placeholder to edit or delete.

The stack, structure, scripts and rules are in [AGENTS.md](./AGENTS.md); how to copy it into a project is in the [root README](../../../README.md#using-a-template).

```bash
cp .env.example .env
bun install            # from the repo root
bun run build:prepare  # generated files (route tree, image types, API layer)
bun run dev
```

The twin template is [`../spa`](../spa).
