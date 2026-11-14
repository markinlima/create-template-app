# Testing

Follows the baseline in `.agents/rules/global/testing.md`, but only partly.

- `lint` runs `ts:check` and Biome. There is no `test` script and there are no tests in this package yet.
- Run `lint` here and `ts:check` in `apps/web`, which consumes the package, after a change.
