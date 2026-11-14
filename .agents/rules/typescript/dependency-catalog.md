# Dependency catalog

Third-party dependency versions are centralized in the root `package.json`, in
`workspaces.catalog` or in a named catalog (`workspaces.catalogs`), and
referenced from each workspace as `"catalog:"` or `"catalog:<name>"`.

- **Used by more than one workspace: it goes in the catalog.** Before adding a
  dependency, check whether another workspace already declares it. If it does,
  or if a second workspace needs it, move the version into the catalog and use
  `catalog:` in every workspace.
- **Used by a single workspace: declare the version directly** in that
  workspace. Move it into the catalog as soon as a second workspace needs it.
- **Exception: a workspace that needs a specific version** (for example, a
  framework that supports only one major of a library). Keep its own pinned
  version, and say why in that workspace's `AGENTS.md`, so the exception is not
  "fixed" by mistake.
- **Named catalogs** (e.g. `tailwindv4`) group packages that must move together.
  Use one only when such a group exists.
- **Internal packages are `workspace:*`**, never in the catalog.
- After changing a catalog entry, run `bun install` at the root.
