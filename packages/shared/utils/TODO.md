# @shared/utils — TODO

Open points found while writing the AI documentation. Nothing here was changed; each item is an observation to confirm (is it intended or should it be fixed?) and, once resolved, to reflect in `AGENTS.md`.

## Behavior

- [x] `waitFor` in its default mode replaced a falsy, non-throwing result with `undefined`. It now resolves with the value the condition returned.
