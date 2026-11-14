# Subagents

Subagents live in `.agents/agents/` (mirrored at `.claude/agents/`). They are not
free: a subagent's context is **per invocation**, not per agent name, so every
call starts from zero and writes its own ~18k-token prefix to the cache, and a
whole run measured ~50k to ~120k input-equivalent units. Numbers and the
method are in [token economy](../../../docs/token-economy.md).

## When a subagent is worth it

There are two reasons, and only the first is about tokens.

1. **Bulky input, small conclusion.** The work would put roughly 13k+ tokens
   into the main context (many file reads, a huge diff or log that cannot be
   filtered) and only the conclusion matters. Main-context tokens are re-read on
   every later reply, so keeping them out pays back the subagent's fixed cost.
   The saving is about `R x (1.25 + 0.1 x N) + K x 0.1 x C` units, with `R` the
   tokens kept out of the main context, `N` the replies that follow, `K` the
   replies of work that stay out of the main conversation and `C` the size of
   the main context (every reply re-reads all of it). It must beat the run's
   cost, ~50k to ~120k units. With a small `C` this is about 13k tokens of `R`
   at N = 50; with a large `C` (150k+) even a few replies of work pay for it.
   Shrinking `C` first (`/clear`) is usually cheaper than delegating.
2. **Behavior of its own.** A fresh, independent context (a reviewer that did
   not write the code), a fixed procedure, restricted tools, or a stronger or
   cheaper model. Here the value is quality and isolation, not tokens.

Do the work **inline** otherwise: a known file, one grep, a handful of lines,
a short command. In particular:

- **Lint, type-check and tests** run inline with filtered output
  ([lint-and-test](./lint-and-test.md)); their output is small.
- **Planning** runs inline ([plan-before-implementing](./plan-before-implementing.md));
  only hard or risky work goes to the built-in `Plan` agent with `model: "opus"`.
- **Long commands** (build, full test suite, migration) run in the background of
  this session with a timeout ([long-running-tasks](./long-running-tasks.md)),
  not in a subagent.
- **CI and container logs**: filter with `grep`/`tail`, or fetch the outcome with
  `gh run view <id> --json conclusion,jobs`, in the same command.
- **Commit, PR and release** (the `commit`, `open-pr` and `release` skills) stay
  in the main conversation: they need the user's approval and run outward-facing
  commands. Their cost is re-reading a large context, so run them with a small
  one (see [clear-on-context-switch](./clear-on-context-switch.md)). For a huge
  diff, read `git diff --stat` first and work one workspace at a time instead of
  reading the whole diff.

## The agents

| Agent               | When                                                                                                                                                                                                                         | Why                                         | Default model |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------- |
| `explorer`          | how a lib or flow works, who depends on it, how a dependency behaves: searches the codebase, Context7, `node_modules` and the web, in that order                                                                             | bulky input                                 | haiku         |
| `code-reviewer`     | **once before opening a PR**, on the whole diff                                                                                                                                                                              | independent context, large diff             | sonnet        |
| `security-reviewer` | **once before opening a PR**, whenever auth, input handling, secrets, env, dependencies, Docker or CI changed                                                                                                                | independent context, large diff             | sonnet        |
| `doc-updater`       | **once before the commit or PR**, on the whole diff, when documented behavior, scripts, structure or APIs changed; many files or external docs; applies the edits itself, following [documentation](../doc/documentation.md) | bulky input                                 | haiku         |
| `browser-tester`    | visual, console, network and performance checks in a real browser                                                                                                                                                            | heavy iterative MCP output, fixed procedure | sonnet        |
| `refactor-cleaner`  | on demand: dead code and duplication report, never deletes                                                                                                                                                                   | bulky input                                 | sonnet        |

Reviewers and the doc-updater run **once per PR or commit over the full diff**,
not after every edit. Group related checks into one invocation: the prefix is
paid per call, and later replies inside a call read it from cache.

Override the model for one call with the `model` parameter of the `Agent` tool
(`haiku`, `sonnet`, `opus`) when the work is easier or harder than the default.
Raise it for judgment-heavy work (large diffs, auth code, cross-module tracing);
lower it for purely mechanical work.

## How to delegate

- Brief it like a peer: goal, which `AGENTS.md`/rules to read, what is already
  ruled out, what "done" looks like. It only knows what the prompt says.
- Ask for a **summary** — conclusions, `path:line` references, no file dumps.
- Subagents cannot ask the user questions. They return _open decisions_; you
  ask the user.
- Independent pieces can run in parallel in one message; dependent ones run in
  order.
- Subagents never commit, push or deploy. Approval for those stays with the
  user (see the `commit` skill). Subagents don't call external services: the
  `doc-updater` edits the repo's docs only (see
  [documentation](../doc/documentation.md)).
- Don't use a subagent to write the main implementation: the user cannot steer
  it mid-way. Use it for reading, checking, reviewing and reporting.
