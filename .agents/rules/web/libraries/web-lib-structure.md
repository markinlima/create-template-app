# Structure of a web lib

How a lib in `packages/web/` is organized, so it is easy to read, maintain and update. It is the same idea as a module of the web app
(see [folder-structure.md](../structure/folder-structure.md)): a lib is a **mini `src`**, with one folder per kind of file. A component folder inside a lib
follows [compound-components.md](../react/compound-components.md).

## The folders

Create only the ones the lib needs.

```
src/
  index.ts          # exports the main function (and what else the lib gives)
  create-thing.ts   # the main function, when it has real logic
  utils/            # small functions
  hooks/            # React hooks
  components/       # components the lib exports
  contexts/         # React contexts
  schemas/          # Zod schemas (and the types inferred from them)
  types/            # type definitions
  lib/              # setup of the libs the lib uses, and adapters to the outside world
  constants/        # constants
  stores/           # Zustand stores
  handlers/         # server handlers and plugins a lib registers (Nitro): only call functions of utils/
  plugins/
  scripts/          # files copied as they are into the output, to run on their own (a health check)
  test/             # fixtures and helpers that only tests use
```

- **`utils/`** — small functions that help to do something and don't hold the whole logic: they do one thing and return something. One
  function per file. When there are many, group them in a subfolder named for the concern (`utils/render/`, `utils/read-routes/`).
- **`hooks/`** — hooks, one per file. When a lib exists to give hooks (a Zustand store read through them), they live here, or are
  returned by the main function when they need what it received.
- **`components/`** — only when the lib exports components. Not every lib does: some leave the element to each app, others (`alert`,
  `ui`) are made of them.
- **`contexts/`** — the same: only when the lib has contexts. (The `context/` folder inside a compound component, from
  [compound-components.md](../react/compound-components.md), keeps its name: it belongs to the component, not to the lib.)
- **`schemas/`** — the Zod schemas; the type inferred from a schema is exported next to it.
- **`types/`** — types and interfaces that are not inferred from a schema.
- **`lib/`** — the configuration of the libraries the lib uses, when there is some, and the adapters that isolate the outside world (the
  browser's events, the file system) so the rest can be tested without it.
- **`handlers/`** and **`plugins/`** — only in a lib that registers server code (`@web/server` with Nitro): the file a framework loads by path. They
  only call functions, the logic is in `utils/`.
- **`scripts/`** — only in a lib that ships a file to run outside the code it belongs to (the health check of `@web/server`, run by the
  `HEALTHCHECK` of an image). It has no imports, because it is copied alone.
- **`constants/`** and **`stores/`** — the names the app's modules already use. **`test/`** is not exported and holds what only tests use.

## File names in a kind folder

A file in `constants/`, `types/`, `schemas/`, `utils/`, `hooks/`... is named for its **subject**, so you know what is inside without opening it.
Never name it after its folder (`constants/constants.ts`, `types/types.ts`, `utils/utils.ts`) or with a generic word (`helpers`, `common`,
`shared`). `constants/update-file.ts` and `constants/update-interval.ts` say what they hold; `constants/constants.ts` says nothing.

- One file per subject. When a folder gets a thing of another subject, make another file: several small files are better than one that
  mixes subjects.
- A file with a single constant or type is fine. The name is the subject of that one thing.
- `index.ts` is the only file that does not follow this: it is the entry of its folder.

## Groups by concern

Inside any kind folder, files are grouped in subfolders **named for the concern** they are about, not left in one long list:
`utils/render/`, `utils/read-routes/`, `hooks/keyboard/`, `schemas/update-file/`. Make a group when two or more files are about the same
thing, or when the folder has more than about six files. The group is always inside its kind (`utils/render/`), never above it
(`render/utils/`). A kind folder with a few unrelated files stays flat.

## The root of `src`

- `index.ts` exports the lib's main function and what the user of the lib needs next to it (its types, its schema). It has no logic.
- The main function lives in a file named for it (`create-update-checker.ts`) next to `index.ts`, unless it is tiny.
- **More than one entry** (`@web/seo/head`, `@web/seo/vite`): each entry is a folder named for it, with its own `index.ts` that exports it,
  and the `exports` of `package.json` points to that `index.ts`. Inside, the folder is a mini `src` with the same subfolders. What only
  one entry uses stays inside it; what several use goes to the folders of the root.

## Tests

A test sits next to the file it tests (`thing.ts` and `thing.test.ts`), in the same folder. Fixtures and helpers that only tests use go to
`test/` and are never exported.

## Files that don't fit a folder

- **A function that has the whole logic of a step** (not a small helper) stays in the root of its folder, next to the main function, named for
  what it does. If a folder fills with them, the lib is probably doing too much.
- **A group of files that work together** (a parser of many small functions) becomes a subfolder of its kind folder (`utils/`) named for the concern.
- **Something that fits no folder:** don't create a folder for one file and don't leave it loose at the root. Ask the user where it goes,
  and write the answer here.

## Don'ts

- Don't put logic in `index.ts`.
- Don't group by the name of a concern at the top level of `src` (`checker/`, `build/`, `render/`); group by kind, and use the concern as
  a subfolder of the kind folder (`utils/render/`).
- Don't export a file that is only for the tests.
- Don't mix two functions in one file in `utils/`.
- Don't name a file after its folder or with a generic word.
